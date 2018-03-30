import React, { Component } from 'react'
import glamorous from 'glamorous'
import 'normalize.css'
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

class App extends Component {
  state = {
    rolls: { ...initialRolls },
    rollsOrder: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    currentRoll: null
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
        currentRoll: random
      }))
    } else {
      this.roll()
    }
  }
  numberAllowed = n => {
    const roll = this.state.rolls[n]
    return roll.rolled < roll.probability
  }
  getRandomRoll = () => {
    return Math.floor(Math.random() * (12 - 1)) + 2 //The maximum is inclusive and the minimum is inclusive
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
        <PossibleRolls
          rolls={this.state.rolls}
          rollsOrder={this.state.rollsOrder}
        />
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
        />
      </glamorous.Div>
    )
  }
}

class CurrentRoll extends React.Component {
  render() {
    const { currentRoll, color, gameFinished } = this.props
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
            fontSize: 300
          }}
        >
          {currentRoll !== null && currentRoll}
        </glamorous.Div>
        <glamorous.Button
          onClick={gameFinished ? this.props.reset : this.props.roll}
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
            '&:hover': {
              background: 'rgba(0,0,0,.1)'
            },
            '&:active': {
              background: 'rgba(255,255,255,.1)'
            }
          }}
        >
          {gameFinished ? 'Reset' : 'Roll'}
        </glamorous.Button>
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
      flexDirection: 'column'
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
