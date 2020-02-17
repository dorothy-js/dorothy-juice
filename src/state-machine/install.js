import { Application } from '@pollon/pollon'
import { StateMachine } from '@pollon/state-machine'
import { Query } from '@pollon/light-dom'
import { Command } from '@pollon/juice-lang'

let NO_OP = function(){}
let installCommand = function( registry, ...data ){
    var selector, name, fsm

    data.shift()
    name = data.shift()
    selector = data.shift()

    if( !Array.from(document.querySelectorAll(selector)).length ){
        return true
    }

    if( !registry[name] ){
        throw 'Command Error: cannot install a non existent statemachine: `' + name +'`'
    }

    fsm = new StateMachine(registry[name].fsm);

    [].forEach.call(document.querySelectorAll(selector), el =>{
        if( !el[`juice:fsm:${name}`] ){
            el[`juice:fsm:${name}`] = fsm
            registry[name].selector = selector
        }
    })

    return true
}

export class Install extends Command{
    constructor( appName, registry ){
        super('Pollon.StateMachine.install', 'install statemachine "([^"]+)" on "([^"]+)"', NO_OP)

        let App = Application.get(appName)

        App.getStateMachine = ( name, selector ) =>{
            if( !registry[name] ){
                return
            }

            let doc = Query(document)
            let el = doc.one(selector)
            if( el.length > 1 ){
                throw `Cannot get ${name} state machine on selector ${selector}. Selector happened to be not unique`
            }

            return el.get(0) && el.get(0)[`juice:fsm:${name}`]
        }

        this.strategy = function( ...args ) {
            return installCommand.apply(this, [registry].concat(...args))
        }
    }
}
