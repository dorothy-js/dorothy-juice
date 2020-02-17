import { Application } from '@pollon/pollon'
import { Subscriber } from '@pollon/message-broker'
import { Command, findBehaviour } from '@pollon/juice-lang'

let strategy = ( appName, data ) => {
    let parts, App, subscription, behaviour, behaviourStmt
    data.shift()
    parts = data.shift().split(':')

    if( parts.length != 2 ){
        throw 'Command Syntax Error: Pollon Events Command'
    }

    App = Application.get(parts[0])
    if( !App ){
        throw `Pollon Events Command: app ${parts[0]} does not exist`
    }



    behaviourStmt = data.shift()
    behaviour = findBehaviour(behaviourStmt)

    subscription = {}
    subscription[parts[1]] = {
        method: ( sender, evt ) =>{
            let el
            el = document.querySelector('[pollon-app]')
            behaviour.execute(behaviourStmt, el)
        },
        once: false
    }

    App.Bus.add(new Subscriber(subscription))

    return true
}

export class ApplicationEvents extends Command{
    constructor( app ){
        super('Pollon.Events', 'when pollon emits "([^"]+)" (.*)', function(){})

        this.strategy = function( ...args ) {
            return strategy.apply(this, [app].concat(args))
        }
    }
}
