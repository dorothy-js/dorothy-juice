import { Application } from '@pollon/pollon'
import { Behaviour } from '@pollon/juice-lang'

let strategy = ( appName, data ) => {
    let parts, App
    data.shift()
    parts = data.shift().split(':')

    if( parts.length != 2 ){
        throw 'Command Syntax Error: Pollon Navigate Command'
    }

    App = Application.get(parts[0])
    if( !App ){
        throw `Pollon Navigate Command: app ${parts[0]} does not exist`
    }

    App.navigate(parts[1])
    return true
}

export class Navigate extends Behaviour{
    constructor( app ){
        super('Pollon.Navigate', 'navigate to "(.*)"', function(){})

        this.strategy = function( ...args ) {
            return strategy.apply(this, [app].concat(args))
        }
    }
}