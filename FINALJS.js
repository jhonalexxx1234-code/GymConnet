function calcularIMC() {
    const pesoInput = document.getElementById('peso').value;
    const alturaInput = document.getElementById('altura').value;
    // Validar que los campos no estén vacíos
    if (!pesoInput || !alturaInput || isNaN(pesoInput) || isNaN(alturaInput) || pesoInput <= 0 || alturaInput <= 0) {
        document.getElementById('resultado').textContent = 'Error';
        document.getElementById('clasificacion').textContent = 'Por favor, ingresa valores válidos.';
        document.getElementById('resultado').style.color = '#d9534f'; // Rojo para error
        return; // Detiene la función si hay error
    }

    // Convertir los valores a números
    const peso = parseFloat(pesoInput); 
    const altura = parseFloat(alturaInput); 
    const imc = peso / (altura * altura);
    const imcRedondeado = imc.toFixed(2);
    let clasificacion = '';
    let color = '';

    if (imc < 18.5) {
        clasificacion = 'Bajo peso 🙁';
        color = '#f0ad4e'; 
    } else if (imc >= 18.5 && imc < 25) {
        clasificacion = 'Peso normal (Saludable) 💪';
        color = '#5cb85c'; 
    } else if (imc >= 25 && imc < 30) {
        clasificacion = 'Sobrepeso ⚠️';
        color = '#f0ad4e'; 
    } else {
        clasificacion = 'Obesidad 🚨';
        color = '#d9534f'; 
    }
    document.getElementById('resultado').textContent = imcRedondeado;
    document.getElementById('clasificacion').textContent = clasificacion;
    document.getElementById('resultado').style.color = color;
}