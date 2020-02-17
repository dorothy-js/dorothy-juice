import { Behaviour } from '@pollon/juice-lang'

let NO_OP = function(){}

let componentStateTransition = function( registry, data, source ){
    let name = data.statemachine

    let statemachine = registry[name]

    if( !statemachine ){
        throw new Error('There\'s no state machine named '+name+' yet. Make sure you have a create command declared before this one.')
    }

    if( !statemachine.selector ){
        throw new Error(`Invalid selector for the state machine named ${name}.`)
    }

    let target = statemachine.selector
    if( !document.querySelectorAll(target).length ){
        throw new Error('There\'s no element matching your "' + target + '" CSS selector.')
    }

    [].forEach.call(target, el =>{
        let fsm = el[`juice:fsm:${name}`]
        if( fsm && fsm.can(data.value) ){
            fsm.handle(data.value)
        }
    })
}

export class Transition extends Behaviour{
    constructor( registry ){
        super('Pollon.StateMachine.transition', 'do statemachine "([^"]+)" transition "([^"]+)"', NO_OP)
        this.strategy = function( ...args ) {
            return componentStateTransition.apply(this, [registry].concat(...args))
        }
    }

    parse( data ){
        data = super.parse(data)
        return {
            statemachine: data[2].trim(),
            value: data[3].trim()
        }
    }
}
