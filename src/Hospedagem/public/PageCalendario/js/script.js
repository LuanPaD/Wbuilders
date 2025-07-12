let mesCalendario;
let anoCalendario;

function criarCalendario(ano, mes) {
    mesCalendario = mes;
    anoCalendario = ano;
    const calendario = document.getElementById('calendar');
    const hoje = new Date();
    const diasNoMes = new Date(ano, parseInt(mes) + 1, 0).getDate();
    const primeiroDia = new Date(ano, mes, 1).getDay();
    let html = '';
    html += '<table>';
    html += '<tr><th>D</th><th>S</th><th>T</th><th>Q</th><th>Q</th><th>S</th><th>S</th></tr>';
    let dia = 1;

    for (let i = 0; i < 6; i++) {
        html += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < primeiroDia) {
                html += '<td></td>';
            } else if (dia <= diasNoMes) {
                let classeCss = '';
                if (dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
                    classeCss = 'hoje';
                }
                html += `<td class="dia ${classeCss}" data-dia="${dia}">${dia}</td>`;
                dia++;
            }
        }
        html += '</tr>';
    }

    html += '</table>';
    calendario.innerHTML = html;
    const cells = calendario.querySelectorAll('td.dia');
    for (const cell of cells) {
        const dia = parseInt(cell.getAttribute('data-dia'));
        if (dataDeveSerMarcada(parseInt(ano), parseInt(mes), parseInt(dia))) {
            cell.classList.add('marcada');
        }
    }

    const mesAtual = parseInt(mes) + 1;
    const anoAtual = parseInt(ano);

    const datasDoMesAtual = datasMarcadas.filter(dataMarcada => {
        return (
            dataMarcada.init.ano === anoAtual &&
            dataMarcada.init.mes === mesAtual
        );
    });
    if (datasMarcadas.length > 0) {
        const dataInitElement = document.getElementById("dataInit");
        const dataEndElement = document.getElementById("dataEnd");

        const primeiraDataDoMes = datasDoMesAtual[0];
        dataInitElement.textContent = `${parseInt(datasMarcadas[0].init.dia)}/${datasMarcadas[0].init.mes}/${datasMarcadas[0].init.ano}`;
        dataEndElement.textContent = `${datasMarcadas[0].end.dia}/${datasMarcadas[0].end.mes}/${datasMarcadas[0].end.ano}`;
    } else {
        const dataInitElement = document.getElementById("dataInit");
        const dataEndElement = document.getElementById("dataEnd");
        dataInitElement.textContent = "Você não possuí reservas nem empréstimos !";
        dataEndElement.textContent = "Nenhuma data marcada";
    }
}

function dataDeveSerMarcada(ano, mes, dia) {
    for (const dataMarcada of datasMarcadas) {
        if (
            (ano === dataMarcada.init.ano && (parseInt(mes) + 1) === dataMarcada.init.mes && dia === dataMarcada.init.dia) ||
            (ano === dataMarcada.end.ano && (parseInt(mes) + 1) === dataMarcada.end.mes && dia === dataMarcada.end.dia) ||
            (ano === dataMarcada.late.ano && (parseInt(mes) + 1) === dataMarcada.late.mes && dia === dataMarcada.late.dia) ||
            (ano === dataMarcada.alert.ano && (parseInt(mes) + 1) === dataMarcada.alert.mes && dia === dataMarcada.alert.dia)) {
            {
                return true;
            }
        } else {
            return false;
        }
    }
}
const calendario = document.getElementById('calendar');


calendario.addEventListener('click', function (event) {
    let dataMarcada = datasMarcadas[0];
    if (event.target.classList.contains('marcada')) {
        if (dataMarcada.init.ano == anoCalendario && dataMarcada.init.mes  == (parseInt(mesCalendario)+1) && dataMarcada.init.dia ==  event.target.getAttribute('data-dia')) {
            alert('Esta data corresponde à data inicial de sua reserva ou empréstimo: ' + event.target.getAttribute('data-dia'));
       } 
       else if (dataMarcada.alert.ano == anoCalendario && dataMarcada.alert.mes  == (parseInt(mesCalendario)+1) && dataMarcada.alert.dia ==  event.target.getAttribute('data-dia')) {
        alert('Esta data corresponde a um dia antes da finalização de sua reserva ou empréstimo: ' + event.target.getAttribute('data-dia'));
        } 
        else if (dataMarcada.late.ano == anoCalendario && dataMarcada.late.mes  == (parseInt(mesCalendario)+1) && dataMarcada.late.dia ==  event.target.getAttribute('data-dia')) {
            alert('Esta data corresponde a um dia após a finalização de sua reserva ou empréstimo: ' + event.target.getAttribute('data-dia'));
            } 
            else if (dataMarcada.end.ano == anoCalendario && dataMarcada.end.mes  == (parseInt(mesCalendario)+1) && dataMarcada.end.dia ==  event.target.getAttribute('data-dia')) {
                alert('Esta data corresponde à data final de sua reserva ou empréstimo: ' + event.target.getAttribute('data-dia'));
                } 
    } else if (event.target.classList.contains('dia')) {
        // Data não marcada.
    }
});

function popularSelecaoDeAno() {
    const selecaoDeAno = document.getElementById('year');
    const anoAtual = new Date().getFullYear();
    const anoInicial = 2023;
    const anosNoFuturo = anoInicial + 10;

    for (let ano = anoAtual; ano >= anoInicial && ano <= anoAtual + anosNoFuturo; ano++) {
        const opcao = document.createElement('option');
        opcao.value = ano;
        opcao.textContent = ano;
        selecaoDeAno.appendChild(opcao);
    }
}

const dataAtual = new Date();
const selecaoDeMes = document.getElementById('month');
const selecaoDeAno = document.getElementById('year');
const botaoMesAnterior = document.getElementById('prevMonth');
const botaoProximoMes = document.getElementById('nextMonth');
const mesAnoAtual = document.getElementById('currentMonthYear');

selecaoDeMes.value = dataAtual.getMonth();
selecaoDeAno.value = dataAtual.getFullYear();
mesAnoAtual.textContent = obterNomeDoMes(dataAtual.getMonth()) + ' ' + dataAtual.getFullYear();

criarCalendario(dataAtual.getFullYear(), dataAtual.getMonth());
popularSelecaoDeAno();

selecaoDeMes.addEventListener('change', function () {
    const mesSelecionado = selecaoDeMes.value;
    const anoSelecionado = selecaoDeAno.value;
    mesAnoAtual.textContent = obterNomeDoMes(mesSelecionado) + ' ' + anoSelecionado;
    mesCalendario =  parseInt(mesAnoAtual.textContent);
    anoCalendario = parseInt(anoSelecionado)
    criarCalendario(anoSelecionado, mesSelecionado);
});

selecaoDeAno.addEventListener('change', function () {
    const mesSelecionado = selecaoDeMes.value;
    const anoSelecionado = selecaoDeAno.value;
    mesAnoAtual.textContent = obterNomeDoMes(mesSelecionado) + ' ' + anoSelecionado;
    mesCalendario =  parseInt(mesAnoAtual.textContent);
    anoCalendario = parseInt(anoSelecionado)
    criarCalendario(anoSelecionado, mesSelecionado);
});

botaoMesAnterior.addEventListener('click', function () {
    const mesAtual = parseInt(selecaoDeMes.value);
    const anoAtual = parseInt(selecaoDeAno.value);

    if (mesAtual === 0) {
        selecaoDeMes.value = 11;
        selecaoDeAno.value = anoAtual - 1;
    } else {
        selecaoDeMes.value = mesAtual - 1;
    }
    mesCalendario =  parseInt(mesAtual.textContent);
    anoCalendario = parseInt(anoAtual)
    mesAnoAtual.textContent = obterNomeDoMes(selecaoDeMes.value) + ' ' + selecaoDeAno.value;
    criarCalendario(selecaoDeAno.value, selecaoDeMes.value);
});

botaoProximoMes.addEventListener('click', function () {
    const mesAtual = parseInt(selecaoDeMes.value);
    const anoAtual = parseInt(selecaoDeAno.value);

    if (mesAtual === 11) {
        selecaoDeMes.value = 0;
        selecaoDeAno.value = anoAtual + 1;
    } else {
        selecaoDeMes.value = mesAtual + 1;
    }
    mesCalendario =  parseInt(mesAtual.textContent);
    anoCalendario = parseInt(anoAtual)
    mesAnoAtual.textContent = obterNomeDoMes(selecaoDeMes.value) + ' ' + selecaoDeAno.value;
    criarCalendario(selecaoDeAno.value, selecaoDeMes.value);
});

function obterNomeDoMes(mes) {
    const nomesDosMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return nomesDosMeses[mes];
} 

document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburguer");
    const mobileMenu = document.querySelector(".mobile-menu");
    const blurBackground = document.querySelector(".blur-background");

    hamburger.addEventListener("click", function () {
        mobileMenu.classList.toggle("active");
        blurBackground.style.display = blurBackground.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
            mobileMenu.classList.remove("active");
            blurBackground.style.display = "none";
        }
    });
});