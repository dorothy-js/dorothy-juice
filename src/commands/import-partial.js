import { Application } from '@pollon/pollon'
import { Command } from '@pollon/juice-lang'

let strategy = ( appName, data ) => {
    let parts, name, App
    data.shift()
    name = data.shift()

    if( !name ){
        throw 'Pollon Import Partial Command: invalid partial name'
    }

    parts = data.shift().split(':')

    if( parts.length != 2 ){
        throw 'Command Syntax Error: Pollon Import Partial Command'
    }

    App = Application.get(parts[0])
    if( !App ){
        throw `Pollon Import Partial Command: app ${parts[0]} does not exist`
    }

    if( !App.Templates.KnockoutPartials ){
        throw 'Pollon Import Partial Command: unable to install this command. KnockoutPartials plugin is missing'
    }

    App.Templates.KnockoutPartials.get(name, parts[1])
    return true
}

export class ImportPartial extends Command{
    constructor( app ){
        super('Pollon.ImportPartial', 'import partial "([^"]+)" from "([^"]+)"', function(){})

        this.strategy = function( ...args ) {
            return strategy.apply(this, [app].concat(args))
        }
    }
}
