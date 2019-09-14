import React from 'react';
import {
  View,
  Image,
  SafeAreaView,
  ImageBackground,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageSourcePropType,
  Dimensions,
  Alert,
  AppState,
} from 'react-native';
import style from './main.style';
import Sound from 'react-native-sound';

interface Props {}

interface State {
  bordom: number;
  shipHorizontalPosition: number;
  shipVerticalPosition: number;
  isSleepingMessageVisible: boolean;
}

const MAX_BORED = 170;
const MIN_HEIGHT = 80;

export default class Main extends React.Component<Props, State> {
  protected interval!: number;
  protected song: Sound;

  protected initialState: State = {
    bordom: 20,
    shipHorizontalPosition: Dimensions.get('window').width / 2 - 50,
    shipVerticalPosition: Dimensions.get('window').height / 2 - 50,
    isSleepingMessageVisible: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {...this.initialState};

    Sound.setCategory('Playback');
    this.song = new Sound('mals_song.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        return;
      }
      this.song.setNumberOfLoops(-1);
      this.startSong();
    });
  }

  public componentDidMount() {
    this.setTimeIncrement();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  public componentWillUnmount() {
    clearInterval(this.interval);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  public componentDidUpdate() {
    if (this.state.shipVerticalPosition <= MIN_HEIGHT + 1) {
      this.crash();
    }
  }

  public setTimeIncrement() {
    this.interval = setInterval(this.incrementTime, 1000);
  }

  render() {
    return (
      <SafeAreaView style={style.rootContainer}>
        <ImageBackground
          source={require('../res/stars.jpg')}
          style={style.background}>
          <this.Serenity />
          <this.Boredom />
          <this.Wash />
          <this.SleepingMessage />
          <this.Planet />
        </ImageBackground>
      </SafeAreaView>
    );
  }

  public Boredom = () => {
    return (
      <View style={style.boredContainer}>
        <Text style={style.boredText}>Bored Bar</Text>
        <View style={style.boredBar}>
          <View
            style={[
              StyleSheet.absoluteFill,
              style.boredBarFill,
              {width: `${this.state.bordom}%`},
            ]}
          />
        </View>
      </View>
    );
  };

  public Serenity = () => {
    return (
      <Image
        resizeMode="contain"
        source={require('../res/ship.jpg')}
        style={[
          style.serenity,
          {
            left: this.state.shipHorizontalPosition,
            bottom: this.state.shipVerticalPosition,
          },
        ]}
      />
    );
  };

  public SleepingMessage = () => {
    return (
      <>
        {this.state.isSleepingMessageVisible && (
          <Text style={style.sleepingWashText}>
            Wash got bored and fell asleep!
          </Text>
        )}
      </>
    );
  };

  public Planet = () => {
    return (
      <View style={style.planetContainer}>
        <Image
          resizeMode="contain"
          source={require('../res/planet.jpg')}
          style={style.planet}
        />
      </View>
    );
  };

  public Wash = () => {
    return (
      <View style={style.washContainer}>
        <this.WashAction
          action={this.fly}
          label="Fly"
          source={require('../res/wash_action.jpg')}
        />
        <this.WashAction
          action={this.play}
          label="Play"
          source={require('../res/wash_play.jpg')}
        />
      </View>
    );
  };

  public WashAction = ({
    action,
    label,
    source,
  }: {
    action: () => void;
    label: string;
    source: ImageSourcePropType;
  }) => {
    return (
      <View style={style.washActionContainer}>
        <Text style={style.washActionText}>{label}</Text>
        <TouchableWithoutFeedback onPress={action}>
          <ImageBackground
            resizeMode="contain"
            source={source}
            style={style.washImage}>
            {!this.isAwake() && (
              <TouchableWithoutFeedback
                onPress={this.setIsSleepingMessageVisible}>
                <Image
                  resizeMode="contain"
                  source={require('../res/zzz.jpg')}
                  style={style.sleepImage}
                />
              </TouchableWithoutFeedback>
            )}
          </ImageBackground>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  protected crash = async () => {
    clearInterval(this.interval);
    await this.stopMusic();
    Alert.alert('Serenity has crashed', 'Everybody is dead', [
      {text: 'Retry', onPress: this.reset},
      {text: 'I accept our fate'},
    ]);
  };

  protected fly = (): void => {
    if (this.isAwake()) {
      this.setState(prevState => ({
        shipVerticalPosition: prevState.shipVerticalPosition + 5,
      }));
    } else {
      this.setIsSleepingMessageVisible();
    }
  };

  protected handleAppStateChange = (currentAppState: string) => {
    if (currentAppState == 'background') {
      this.song.pause();
    }
    if (currentAppState == 'active') {
      this.song.play();
    }
  };

  protected incrementTime = (): void => {
    this.setState(prevState => ({
      bordom: Math.min(prevState.bordom + 10, MAX_BORED),
      shipHorizontalPosition:
        (prevState.shipHorizontalPosition + 10) %
        Dimensions.get('window').width,
      shipVerticalPosition: prevState.shipVerticalPosition - 10,
    }));
  };

  protected isAwake = (): boolean => {
    return this.state.bordom < MAX_BORED;
  };

  protected stopMusic = async (i: number = 0.8) => {
    new Promise(resolve => {
      this.song.setVolume(i);
      if (i > 0.05) {
        setTimeout(() => this.stopMusic(i * 0.8), 100);
      } else {
        this.song.stop();
        resolve();
      }
    });
  };

  protected play = (): void => {
    if (this.isAwake()) {
      this.setState(prevState => ({
        bordom: prevState.bordom - 3,
      }));
    } else {
      this.setIsSleepingMessageVisible();
    }
  };

  protected reset = () => {
    this.setState({...this.initialState}, () => {
      this.setTimeIncrement();
      this.startSong();
    });
  };

  protected setIsSleepingMessageVisible = () => {
    this.setState({isSleepingMessageVisible: true});
  };

  protected startSong = () => {
    this.song.setVolume(1);
    this.song.setCurrentTime(3);
    this.song.play();
  };
}
