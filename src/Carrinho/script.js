$(document).ready(function() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho = carrinho.filter(item => item !== null && item !== undefined && item.desc);

    const listElement = $("#lista");
    const totalElement = $("#total");

    function exibirCarrinho(){
        listElement.empty();
        let totalPreco = 0;

        if (carrinho.length === 0) {
            listElement.append("<li>O seu carrinho está vazio.</li>");
            totalElement.text("Total: R$ 0,00");
            return;
        }

        $.each(carrinho, function(index, item){
            const valorItem = parseFloat(item.valor).toFixed(2).replace('.', ',');
            const listItem = $("<li>").text(`${item.desc} - Preço: R$ ${valorItem}`);

            const itemIndex = index;

            const removeButton = $("<button>").text("❌").css("margin-left", "10px").click(function(){
                removerItem(itemIndex);
            });

            listItem.append(removeButton);
            listElement.append(listItem);

            totalPreco += parseFloat(item.valor);
        });
        
        const totalFormatado = totalPreco.toFixed(2).replace('.', ',');
        totalElement.text(`Total: R$ ${totalFormatado}`);
    }

    function removerItem(index){
        carrinho.splice(index, 1);
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        exibirCarrinho();
    }
    
    exibirCarrinho();
    window.carrinhoGlobal = carrinho;
});

function gerar(){
    const listaElement = document.getElementById("lista"); 
    const totalElement = document.getElementById("total"); 
    
    if (!listaElement || !totalElement) return;

    const carrinho = window.carrinhoGlobal || [];
    if (carrinho.length === 0) {
        alert("Adicione produtos ao carrinho antes de gerar o pedido!");
        return;
    }

    let listaHtml = "";
    let totalPreco = 0;

    carrinho.forEach(item => {
        const valorItem = parseFloat(item.valor).toFixed(2).replace('.', ',');
        listaHtml += `<li>${item.desc} - Preço: R$ ${valorItem}</li>`;
        totalPreco += parseFloat(item.valor);
    });

    const totalFormatado = totalPreco.toFixed(2).replace('.', ',');
    const totalHtml = `Total: R$ ${totalFormatado}`;

    const conteudoHTML = `
        <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 20px; }
                    h1 { color: #2c3e50; font-size: 24px; border-bottom: 2px solid #34495e; padding-bottom: 10px; }
                    h3 { color: #7f8c8d; font-size: 16px; }
                    ul { margin-top: 20px; }
                    li { font-size: 14px; margin-bottom: 8px; list-style-type: square; }
                    .total { font-size: 18px; font-weight: bold; color: #27ae60; margin-top: 30px; }
                </style>
            </head>
            <body>
                <h1>PEDIDO CONFIRMADO</h1>
                <h3>Agradecemos a sua compra e preferência.</h3>
                <br>
                <ul>
                    ${listaHtml}
                </ul>
                <br>
                <div class="total">${totalHtml}</div>
            </body>
        </html>  
    `;

    const blob = new Blob([conteudoHTML], {type: "application/msword"});
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "pedido.doc";
    link.click();
    
    const divPedido = document.getElementById("pedido");
    if (divPedido) {
        divPedido.style.display = "block";
    }
}

function successClose(){
    const divPedido = document.getElementById("pedido");
    if (divPedido) {
        divPedido.style.display = "none";
    }
}