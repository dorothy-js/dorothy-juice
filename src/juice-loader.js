import { TemplateLoader } from '@pollon/pollon'
import { Lifecycle } from './commands/lifecycle'
import { ApplicationEvents } from './commands/application-events'
import { ImportPartial } from './commands/import-partial'
import { Navigate } from './behaviours/navigate'

import { Create as StateMachineCreate } from './state-machine/create'
import { Install as StateMachineInstall } from './state-machine/install'
import { Listener as StateMachineListener } from './state-machine/status-listener'
import { Transition as StateMachineTransition } from './state-machine/transition'



export class Loader extends TemplateLoader{

    constructor( appName, juice, extension ){
        super(appName)
        this.extension = extension || '.juice'

        let Ruleset = juice.Ruleset
        Ruleset.addCommand(new Lifecycle(appName))
        Ruleset.addCommand(new ApplicationEvents(appName))
        Ruleset.addCommand(new ImportPartial(appName))

        let statemachineRegistry = {}
        Ruleset.addCommand(new StateMachineCreate(statemachineRegistry))
        Ruleset.addCommand(new StateMachineInstall(appName, statemachineRegistry))
        Ruleset.addCommand(new StateMachineListener(statemachineRegistry))
        Ruleset.addBehaviour(new StateMachineTransition(statemachineRegistry))

        Ruleset.addBehaviour(new Navigate(appName))


        this.juice = juice
    }

    get( input ){
        let info


        if( !this.canParse(input) ){
            return Promise.reject(`Pollon: [template:juice] ${input} element is unparseable by the Juice loader`)
        }

        info = this.getInfo(input)
        if( this.cache.get(info.id) ){
            return Promise.resolve()
        }

        return super.get(input)
            .then( text =>{
                this.juice.parse(text)
                this.cache.put(info.id, true)
                return text
            })
    }

    onUnloadable( url, info, reason ){
        return super.onUnloadable(url, info, reason)
            .then(function( message ){
                console.warn(`Pollon: [template:juice] Juice template loader: ${message}`)
                return ''
            }).catch(function( message ){
                console.warn(`Pollon: [template:juice] Juice template loader: ${message}`)
                return ''
            })
    }
}
