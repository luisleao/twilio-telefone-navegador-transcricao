
const escondeNumero = function(number) {
    // +5511999991234 => +55119****-1234
    if (number) number = number.replace('whatsapp:', '');
    if (!number || number.length < 12) return '+-----****-----';
    return number.substr(0, number.length - 8) + '****-' + number.substr(number.length - 4 )
}


module.exports = { escondeNumero }