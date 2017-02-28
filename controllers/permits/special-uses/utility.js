/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************
// required modules

var _ = require('lodash');

//*******************************************************************

function build_error_message(error_array){

    var error_message = _.join(error_array,' and ');

    if(error_array.length>1){

        error_message += ' are required fields!';

    }else{

        error_message += ' is a required field!';

    }

    return error_message;

}

//*******************************************************************
// exports

module.exports.build_error_message = build_error_message;