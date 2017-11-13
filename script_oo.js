var logToFile = {
    initialize: function () {

        if (localStorage.getItem("log_file") === null) {
            //Ficheiro de Log não existe
            //Define um nome com timestamp
            var logFileName = 'log_' + Math.floor(Date.now() / 1000) + '_.txt';

            //Cria ficheiro de log
            this.createLogFile(logFileName);

            //Atualiza o storage
            localStorage.setItem("log_file", logFileName);

        } else {
            //Ficheiro de Log existe
            //Vai buscar o nome do ficheiro da storage
            var logFileName = localStorage.getItem("log_file");

            //Verifica a validade do ficheiro de log (10 dias)

            if (this.logFileValidate(logFileName, this.logFileExpirationTime)) {
                //Válido
                //Grava log no ficheiro
                this.createLogFile(logFileName)

            } else {
                //Apaga o ficheiro
                this.removeLogFile(logFileName);
                //Criar um novo ficheiro atualizado
                //Cria um novo nome de ficheiro atualizado
                logFileName = 'log_' + Math.floor(Date.now() / 1000) + '_.txt';
                //Cria novo ficheiro atualizado
                this.createLogFile(logFileName);
                localStorage.setItem("log_file", logFileName);
            }
        }
    },
    logOb: null,
    logFileExpirationTime: 10,

    info: function (text, tipo = 'INFO') {
        this.writeLog(text, tipo);
    },

    diretoryLogs: function () {

        switch (device.platform) {
            case 'Android':
                return cordova.file.externalApplicationStorageDirectory;
                break;
            case 'iOS':
                return cordova.file.applicationStorageDirectory;
                break;
            default:
                return this.error;

        }

    },
    createLogFile: function (logFileName) {

        window.resolveLocalFileSystemURL(this.diretoryLogs(), function (dir) {
            console.log("Entrou no diretorio:", dir);

            dir.getFile(logFileName, {create: true}, function (file) {
                console.log("Obteve ficheiro", file);
                this.logOb = file;

            });
        });

    },
    removeLogFile: function (logFileName) {

        window.resolveLocalFileSystemURL(this.diretoryLogs, function (dir) {
            console.log("Entrou no diretorio:", dir);

            dir.getFile(logFileName, {create: false}, function (file) {
                console.log("Obteve ficheiro", file);

                file.remove(function () {
                    //Removido com sucesso

                }, function (error) {
                    //Erro ao remover ficheiro


                }, function () {
                    //Ficheiro nao existe!

                });

            });
        });

    },
    writeLog: function (str, tipo) {

        if (!this.logOb) return;

        var log = this.getNowDateFormattedToLog() + ' : ' + tipo + ' : ' + str + '\n';


        this.logOb.createWriter(function (fileWriter) {
            fileWriter.seek(fileWriter.length);
            var blob = new Blob([log], {type: 'text/plain'});
            fileWriter.write(blob);
            console.log("Adicionou ao ficheiro log!");
        }, this.fail);

    },
    /**
     * Verifica se ficheiro de Log é válido
     * @param {any} nome_ficheiro
     * @param {any} dias_validade
     */

    logFileValidate: function (nome_ficheiro, dias_validade) {
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
    },
    /**
     * Devolve data atual no formato: dd-mm-yyyy hh:mm:ss.nnn
     * @returns {string}
     */
    getNowDateFormattedToLog: function () {
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
    },
    fail: function (e) {
        console.log("FileSystem Error");
        console.dir(e);
    }

}

/** Ytstar*/
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    logToFile.initialize();


    document.querySelector("#actionOne").addEventListener("touchend", function (e) {

        logToFile.info('Entrou na 1ª Opção', 'INFO');
    }, false);

    document.querySelector("#actionTwo").addEventListener("touchend", function (e) {

        logToFile.info('Entrou na 2ª Opção!', 'INFO');
    }, false);

}