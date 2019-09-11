import {StyleSheet, Dimensions} from 'react-native';

const barColor: string = '#4293f5';

export default StyleSheet.create({
  background: {
    height: Dimensions.get('window').height,
  },
  boredBar: {
    borderColor: barColor,
    borderWidth: 1,
    height: 50,
    paddingStart: 40,
    paddingTop: 50,
    width: 100,
  },
  boredBarFill: {
    backgroundColor: barColor,
    flex: 1,
  },
  boredContainer: {
    alignItems: 'center',
  },
  boredText: {
    color: '#b9f542',
    fontSize: 30,
    fontWeight: '500',
  },
  planet: {},
  planetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  rootContainer: {
    flex: 1,
  },
  serenity: {
    position: 'absolute',
    width: 100,
    zIndex: 10,
  },
  sleepImage: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  sleepingWashText: {
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 25,
    marginTop: 10,
  },
  washContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 20,
  },
  washActionContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  washActionText: {
    color: '#2f95bd',
    fontSize: 24,
    fontWeight: '500',
  },
  washImage: {
    height: 150,
    marginTop: 20,
    width: Dimensions.get('window').width / 2,
    zIndex: 5,
  },
});
