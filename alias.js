const path=require('path');
const moduleAlias=require('module-alias');

moduleAlias.addAlias('@root',__dirname);
moduleAlias.addAlias('@routes',path.join(__dirname,'src/routes'));
moduleAlias.addAlias('@controllers',path.join(__dirname,'src/controllers'));
moduleAlias.addAlias('@helper',path.join(__dirname,'src/helper'));
moduleAlias.addAlias('@models',path.join(__dirname,'src/services/db/models'));
moduleAlias.addAlias('@db',path.join(__dirname,'src/services/db'));


moduleAlias.addAlias('@Validation',path.join(__dirname,'src/validation'));

moduleAlias.addAlias('@middleware',path.join(__dirname, 'src/middlewares'));

// moduleAlias.addAlias('@ ')
moduleAlias.addAlias('@AuthValidation',path.join(__dirname,'src/validation/AuthValidation'));
moduleAlias.addAlias('@CallsValidation',path.join(__dirname,'src/validation/CallsValidation'));


moduleAlias.addAlias('@public',__dirname,'public');