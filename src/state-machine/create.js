import { Command } from '@pollon/juice-lang'

let NO_OP = function(){}
let createCommand = function( registry, ...data ){
    let name, re, transitions, states, initialState

    data.shift()
    name = data.shift()

    re = /(?:([a-zA-Z0-9 ]+) from ([a-zA-Z0-9 ]+) to ([a-zA-Z0-9 ]+))/

    transitions = data.shift().split(',')

    let n = transitions.length

    for( let i = 0; i < n; i++ ){
        if( !re.test(transitions[i]) ){
            throw 'Command Syntax Error: Create Command'
        }
    }

    for( let i = 0; i < n; i++ ){
        transitions[i] = re.exec(transitions[i])
    }

    states = {}
    transitions.forEach(function( x, i ){
        if( !states[x[2].trim()] ){
            states[x[2].trim()] = {}
        }
        states[x[2].trim()][x[1].trim()] = x[3].trim()
    })

    if( registry[name] ){
        console.warn('There\'s already a state machine named '+name+'. Skipping creation.')
        return true
    }

    initialState = Object.keys(states)
    initialState = states[initialState[0]] ? initialState[0] : null

    registry[name] = {
        fsm:{
            initial: initialState,
            transitions: states
        }
    }

    return true
}

export class Create extends Command{
    constructor( registry ){
        super('Pollon.StateMachine.create', 'create statemachine "([^"]+)" with (?:status|statuses) (.*)', NO_OP)

        this.strategy = function( ...args ) {
            return createCommand.apply(this, [registry].concat(...args))
        }
    }
}
