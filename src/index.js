import { Loader  } from './juice-loader'

export const JuiceLoader = {
    install: function( App, config ){
        return App.load('@pollon/juice-lang')
            .then(module =>{
                App.Templates.Juice = new Loader(App.name, module)
            })
    }
}
