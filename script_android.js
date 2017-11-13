/* globals console,document,window,cordova */
document.addEventListener('deviceready', onDeviceReady, false);
/**
 * logToFile.info('Texto', 'Tipo');
 */
var logToFile = {
    info: function (text, tipo = 'INFO') {
        window.writeLog(text, tipo);
    }
}


//Objeto log
var logOb;


function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
}

function onDeviceReady() {
    //localStorage.removeItem("log_file");
    alert(device.platform);

    if (localStorage.getItem("log_file") === null) {
        //Ficheiro de Log não existe
        //Define um nome com timestamp
        var logFileName = 'log_' + Math.floor(Date.now() / 1000) + '_.txt';

        //Cria ficheiro de log
        createLogFile(logFileName);

        //Atualiza o storage
        localStorage.setItem("log_file", logFileName);


    } else {


        //Ficheiro de Log existe
        //Vai buscar o nome do ficheiro da storage
        var logFileName = localStorage.getItem("log_file");

        alert(logFileValidate(logFileName, 10));


        //Verifica a validade do ficheiro de log (10 dias)

        if (logFileValidate(logFileName, 10)) {

            //Válido
            //Grava log no ficheiro
            createLogFile(logFileName)

        } else {
            //Apaga o ficheiro
            removeLogFile(logFileName);
            //Criar um novo ficheiro atualizado
            //Cria um novo nome de ficheiro atualizado
            logFileName = 'log_' + Math.floor(Date.now() / 1000) + '_.txt';
            //Cria novo ficheiro atualizado
            createLogFile(logFileName);
            localStorage.setItem("log_file", logFileName);
        }
    }


    document.querySelector("#actionOne").addEventListener("touchend", function (e) {

        window.logToFile.info('Entrou na 1ª Opção');
    }, false);

    document.querySelector("#actionTwo").addEventListener("touchend", function (e) {

        window.logToFile.info('Entrou na 2ª Opção!');
    }, false);

}

function createLogFile(logFileName) {

    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function (dir) {
        console.log("Entrou no diretorio:", dir);

        dir.getFile(logFileName, {create: true}, function (file) {
            console.log("Obteve ficheiro", file);
            logOb = file;

        });
    });

}

function removeLogFile(logFileName) {

    window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function (dir) {
        console.log("Entrou no diretorio:", dir);

        dir.getFile(logFileName, {create: false}, function (file) {
            console.log("Obteve ficheiro", file);
            //logOb = file;
            file.remove(function () {
                //Removido com sucesso

            }, function (error) {
                //Erro ao remover ficheiro


            }, function () {
                //Ficheiro nao existe!

            });

        });
    });

}

function writeLog(str, tipo = 'INFO') {

    if (!logOb) return;

    var log = getNowDateFormattedToLog() + ' : ' + tipo + ' : ' + str + '\n';


    logOb.createWriter(function (fileWriter) {
        fileWriter.seek(fileWriter.length);
        var blob = new Blob([log], {type: 'text/plain'});
        fileWriter.write(blob);
        console.log("Adicionou ao ficheiro log!");
    }, fail);

}

/**

 * Verifica se o ficheiro de logs é válido ou não
 * @param {any} nome_ficheiro
 * @param {any} dias_validade
 */
function logFileValidate(nome_ficheiro, dias_validade) {
    //Timestamp atual em segundos
    var timestamp = Math.floor(Date.now() / 1000);

    //Timestamp guardado no ficheiro
    var timestamp_log = nome_ficheiro.split("_");
    //Timestamp da criação do ficheiro + tempo de validade em dias
    //timestamp_log_lim_sup = parseInt(timestamp_log[1]) + (86400 * dias_validade);
    var timestamp_log_lim_sup = parseInt(timestamp_log[1]) + (20);
    //Se estiver válido
    if (timestamp_log_lim_sup - timestamp > 0) {
        //Grava log no ficheiro
        return true;

    } else {
        //Limpa ficheiro e grava
        return false;
    }
}


/**
 * Devolve data atual no formato: dd-mm-yyyy hh:mm:ss.nnn
 * @returns {string}
 */
function getNowDateFormattedToLog() {
    var now = new Date();
    var dia, mes, ano, horas, minutos, segundos, milisegundos;

    dia = now.getDate();
    if (dia.toString().length == 1) {
        dia = "0" + dia;
    }

    mes = now.getMonth();
    if (mes.toString().length == 1) {
        mes = "0" + mes;
    }

    ano = now.getFullYear();
    if (ano.toString().length == 1) {
        ano = "0" + ano;
    }

    horas = now.getHours();
    if (horas.toString().length == 1) {
        horas = "0" + horas;
    }

    minutos = now.getMinutes();
    if (minutos.toString().length == 1) {
        minutos = "0" + minutos;
    }

    segundos = now.getSeconds();
    if (segundos.toString().length == 1) {
        segundos = "0" + segundos;
    }

    milisegundos = now.getMilliseconds();
    if (milisegundos.toString().length == 1) {
        milisegundos = milisegundos + "00";
    } else if (milisegundos.toString().length == 2) {
        milisegundos = milisegundos + "0";
    }
    return dia + '-' + mes + '-' + ano + ' ' + horas + ':' + minutos + ':' + segundos + '.' + milisegundos;
}