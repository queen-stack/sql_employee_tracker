//const chalk = require('chalk');
// render image
function renderImage() {
  console.log(chalk.hex("	#228B22")(String.raw`
#######                                                    #######                                           
#       #    # #####  #       ####  #   # ###### ######       #    #####    ##    ####  #    # ###### #####  
#       ##  ## #    # #      #    #  # #  #      #            #    #    #  #  #  #    # #   #  #      #    # 
#####   # ## # #    # #      #    #   #   #####  #####        #    #    # #    # #      ####   #####  #    # 
#       #    # #####  #      #    #   #   #      #            #    #####  ###### #      #  #   #      #####  
#       #    # #      #      #    #   #   #      #            #    #   #  #    # #    # #   #  #      #   #  
####### #    # #      ######  ####    #   ###### ######       #    #    # #    #  ####  #    # ###### #    # `));
  console.log(chalk.dim("  Database\n"));
}
exports.renderImage = renderImage;

const chalk = require('chalk');
 



