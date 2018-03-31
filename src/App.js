import React, { Component } from 'react'
import glamorous from 'glamorous'
import 'normalize.css'
import diceAudio from './dice.mp3'
import './App.css'

const initialRolls = {
  2: {
    number: 2,
    probability: 1,
    rolled: 0,
    color: 'rgb(230, 50, 50)'
  },
  3: {
    number: 3,
    probability: 2,
    rolled: 0,
    color: 'rgb(238, 128, 57)'
  },
  4: {
    number: 4,
    probability: 3,
    rolled: 0,
    color: 'rgb(246, 216, 110)'
  },
  5: {
    number: 5,
    probability: 4,
    rolled: 0,
    color: 'rgb(139, 223, 80)'
  },
  6: {
    number: 6,
    probability: 5,
    rolled: 0,
    color: 'rgb(94, 236, 142)'
  },
  7: {
    number: 7,
    probability: 6,
    rolled: 0,
    color: 'rgb(65, 230, 215)'
  },
  8: {
    number: 8,
    probability: 5,
    rolled: 0,
    color: 'rgb(71, 103, 218)'
  },
  9: {
    number: 9,
    probability: 4,
    rolled: 0,
    color: 'rgb(142, 67, 227)'
  },
  10: {
    number: 10,
    probability: 3,
    rolled: 0,
    color: 'rgb(212, 76, 219)'
  },
  11: {
    number: 11,
    probability: 2,
    rolled: 0,
    color: 'rgb(200, 52, 145)'
  },
  12: {
    number: 12,
    probability: 1,
    rolled: 0,
    color: 'rgb(236, 2, 86)'
  }
}

const getRandomRoll = () => Math.floor(Math.random() * (12 - 1)) + 2

class App extends Component {
  state = {
    rolls: { ...initialRolls },
    rollsOrder: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    currentRoll: null,
    showRolls: true,
    history: []
  }
  roll = () => {
    const random = this.getRandomRoll()
    if (this.numberAllowed(random)) {
      this.setState(state => ({
        rolls: {
          ...state.rolls,
          [random]: {
            ...state.rolls[random],
            rolled: state.rolls[random].rolled + 1
          }
        },
        currentRoll: random,
        history: [state.currentRoll, ...state.history]
      }))
    } else {
      this.roll()
    }
  }
  undoRoll = () => {
    this.setState(state => ({
      rolls: {
        ...state.rolls,
        [state.currentRoll]: {
          ...state.rolls[state.currentRoll],
          rolled: state.rolls[state.currentRoll].rolled - 1
        }
      },
      currentRoll: state.history[0],
      history: state.history.slice(1)
    }))
  }
  numberAllowed = n => {
    const roll = this.state.rolls[n]
    return roll.rolled < roll.probability
  }
  getRandomRoll = () => {
    return getRandomRoll() //The maximum is inclusive and the minimum is inclusive
  }
  getGameStatus = () => {
    return this.state.rollsOrder.every(r => {
      const roll = this.state.rolls[r]
      return roll.probability === roll.rolled
    })
  }
  reset = () => {
    this.setState({ rolls: { ...initialRolls }, currentRoll: null })
  }
  toggleShowRolls = () => {
    this.setState(state => ({
      showRolls: !state.showRolls
    }))
  }
  render() {
    return (
      <glamorous.Div
        css={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        {
          this.state.showRolls &&
          <PossibleRolls
            rolls={this.state.rolls}
            rollsOrder={this.state.rollsOrder}
          />
        }
        <CurrentRoll
          roll={this.roll}
          currentRoll={this.state.currentRoll}
          color={
            this.state.rolls[this.state.currentRoll]
              ? this.state.rolls[this.state.currentRoll].color
              : ''
          }
          gameFinished={this.getGameStatus()}
          reset={this.reset}
          toggleShowRolls={this.toggleShowRolls}
          showRolls={this.state.showRolls}
          history={this.state.history}
          undoRoll={this.undoRoll}
        />
      </glamorous.Div>
    )
  }
}

let animationTicker = 60;

class CurrentRoll extends React.Component {
  state = {rolling: false, rollingFrame: 2}
  roll = () => {
    this.audio.currentTime = 0
    this.audio.play()
    this.startRollingAnimation()
  }
  startRollingAnimation = () => {
    this.setState({
      rolling: true
    })
    window.requestAnimationFrame(this.animateRoll)
  }
  animateRoll = () => {
    if(animationTicker%5 === 0){
      this.setState({
        rollingFrame: getRandomRoll()
      })
    }
    animationTicker -= 1;
    if(animationTicker > 0){
      window.requestAnimationFrame(this.animateRoll)
    }else{
      this.stopRollingAnimation()
    }
  }
  stopRollingAnimation = () => {
    animationTicker = 60;
    this.setState({
      rolling: false
    })
    this.props.roll()
  }
  render() {
    const { currentRoll, color, gameFinished, toggleShowRolls, showRolls, undoRoll, history } = this.props
    return (
      <glamorous.Div
        css={{
          flex: '1 0 auto',
          display: 'flex',
          height: '100%',
          background: color,
          flexDirection: 'column',
          transition: 'background 300ms'
        }}
      >
        <glamorous.Div
          css={{
            flex: '0 0 75%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            fontSize: 300,
            position: 'relative',
            userSelect: 'none',
            '@media only screen and (max-width: 500px)': {
              fontSize: 150
            }
          }}
        >
          <glamorous.Button onClick={toggleShowRolls} css={{
            position: 'absolute',
            left: 10,
            top: 10,
            fontSize: 16,
            fontWeight: 400,
            background: 'none',
            border: 'none',
            outline: 'none',
            padding: '5px 10px',
            '&:hover': {
              background: 'rgba(0,0,0,.1)'
            }
          }}>
            {showRolls ? 'Hide' : 'Show'} All Rolls
          </glamorous.Button>
          {
            history.length > 0 &&
            <glamorous.Button onClick={undoRoll} css={{
              position: 'absolute',
              right: 10,
              top: 10,
              fontSize: 16,
              fontWeight: 400,
              background: 'none',
              border: 'none',
              outline: 'none',
              padding: '5px 10px',
              '&:hover': {
                background: 'rgba(0,0,0,.1)'
              }
            }}>
              Undo Last Roll
            </glamorous.Button>
          }
          {this.state.rolling ? this.state.rollingFrame : currentRoll !== null && currentRoll}
        </glamorous.Div>
        <glamorous.Button
          onClick={gameFinished ? this.props.reset : this.state.rolling ? ()=>{} : this.roll}
          css={{
            display: 'flex',
            background: 'rgba(0,0,0,.2)',
            border: 'none',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 100,
            cursor: 'pointer',
            outline: 'none',
            color: this.state.rolling ? 'rgba(0,0,0,.4)' : '',
            '&:hover': {
              background: 'rgba(0,0,0,.1)'
            },
            // '&:active': {
            //   background: 'rgba(255,255,255,.1)'
            // },
            '@media only screen and (max-width: 500px)': {
              fontSize: 70
            }
          }}
        >
          {gameFinished ? 'Reset' : this.state.rolling ? 'Rolling' : 'Roll'}
        </glamorous.Button>
        <audio
          ref={ref=>{this.audio = ref}}
          src={diceAudio}
        />
      </glamorous.Div>
    )
  }
}

const PossibleRolls = ({ rolls, rollsOrder }) => (
  <glamorous.Div
    css={{
      flex: '0 0 auto',
      width: 200,
      height: '100%',
      background: 'rgba(0,0,0,.1)',
      display: 'flex',
      flexDirection: 'column',
      '@media only screen and (max-width: 500px)': {
        width: 100
      }
    }}
  >
    {rollsOrder.map(r => <Roll {...rolls[r]} key={r} />)}
  </glamorous.Div>
)

const Roll = ({ number, probability, rolled, color }) => (
  <glamorous.Div
    css={{
      flex: '1 1 auto',
      display: 'flex',
      position: 'relative',
      alignItems: 'center'
    }}
  >
    <glamorous.Span
      css={{
        fontSize: 50,
        padding: '0px 10px',
        // minWidth: 80,
        textAlign: 'center'
      }}
    >
      {number}
    </glamorous.Span>
    <ProgressBar probability={probability} color={color} rolled={rolled} />
  </glamorous.Div>
)

const ProgressBar = ({ probability, rolled, color }) => (
  <glamorous.Div
    css={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      zIndex: -1
    }}
  >
    {[...Array(probability)].map((_, i) => (
      <Segment active={i < rolled} index={i} color={color} key={i} />
    ))}
  </glamorous.Div>
)

const Segment = glamorous.div(({ active, index, color }) => ({
  flex: '1 1 auto',
  background: active ? color : `rgba(0,0,0,${index * 0.05})`,
  transition: 'background 200ms'
}))

export default App
