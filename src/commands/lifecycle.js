import { Application } from '@pollon/pollon'
import { Command, findBehaviour } from '@pollon/juice-lang'

let strategy = ( appName, data ) => {
    let parts, App, eventType, method, behaviour, behaviourStmt
    data.shift()
    parts = data.shift().split(':')

    if( parts.length != 2 ){
        throw 'Command Syntax Error: Pollon Lifecycle Command'
    }

    App = Application.get(parts[0])
    if( !App ){
        throw `Pollon Lifecycle Command: app ${parts[0]} does not exist`
    }

    eventType = data.shift()

    switch( eventType ){
    case 'initialized':
        method = 'moduleInitialized'
        break
    case 'loaded':
        method = 'moduleLoaded'
        break
    case 'ready':
        method = 'moduleReady'
        break
    case 'disposed':
        method = 'moduleDisposed'
        break
    }

    behaviourStmt = data.shift()
    behaviour = findBehaviour(behaviourStmt)

    App[method].subscribe((_, args) => {
        if( args.module != parts[1] ){
            return
        }
        let el
        if( 'initialized' != eventType ){
            el = document.querySelector(`[data-view="${args.module}"]`)
        }

        behaviour.execute(behaviourStmt, el)
    })

    return true
}

export class Lifecycle extends Command{
    constructor( app ){
        super('Pollon.Lifecycle', 'when module "([^"]+)" is (initialized|loaded|ready|disposed) (.*)', function(){})

        this.strategy = function( ...args ) {
            return strategy.apply(this, [app].concat(args))
        }
    }
}
