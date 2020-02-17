import { StateMachine } from '@pollon/state-machine'
import { Command, findBehaviour } from '@pollon/juice-lang'

let NO_OP = function(){}
let statusListenerCommand = function( registry, ...data ){
    let selector, name, status, behaviourStmt, behaviour, statemachine

    data.shift()
    name = data.shift()
    status = data.shift()
    behaviourStmt = data.shift()

    statemachine = registry[name]

    if( !statemachine ){
        throw new Error('There\'s no state machine named '+name+' yet. Make sure you have a create command declared before this one.')
    }

    if( !statemachine.selector ){
        throw new Error(`Invalid selector for the state machine named ${name}.`)
    }


    if( !document.querySelectorAll(statemachine.selector).length ){
        throw new Error('There\'s no element matching your "' + selector + '" CSS selector.')
    }

    selector = statemachine.selector
    behaviour = findBehaviour(behaviourStmt)

    let source = document.querySelectorAll(selector);

    [].forEach.call(source, el =>{
        if( !el[`juice:fsm:${name}`] ){
            return
        }
        el[`juice:fsm:${name}`].on(StateMachine.EVENTS.ENTERED, status, ( sender, event ) =>{
            behaviour.execute(behaviourStmt, el)
        })
    })

    return true
}

export class Listener extends Command{
    constructor( registry ){
        super('Pollon.StateMachine.listener', 'when statemachine "([^"]+)" status is "([^"]+)" (.*)', NO_OP)

        this.strategy = function( ...args ) {
            return statusListenerCommand.apply(this, [registry].concat(...args))
        }
    }
}
