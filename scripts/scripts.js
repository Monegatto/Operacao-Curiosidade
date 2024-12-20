window.addEventListener('load', () => {
    let userLogado = document.querySelector("p.userLogado")
    if(userLogado)
        userLogado.innerHTML = sessionStorage.getItem("Logado")

    let pesquisa = document.querySelector("input#ipesquisa")
    if(pesquisa)
        pesquisa.addEventListener('keyup', pesquisar)

    let aside = document.querySelector("span.menuAside")
    if(aside){
        aside.addEventListener('click', menuAside)
        window.addEventListener('resize', mudouTamanho)
    }

    let cards = document.querySelector("span.menuCards")
    if(cards)
        cards.addEventListener('click', menuCards)

})

function pesquisar(){
    let termo = document.querySelector("input#ipesquisa").value.toUpperCase()
    let tabela = document.querySelector("tbody")
    let encontrou

    for(let i = 0; i < tabela.rows.length; i++){
        tabela.rows[i].style.display = ""
        encontrou = false
loopCell:
        for(let j = 0; j < tabela.rows[i].cells.length; j++){
            let conteudoCelula = tabela.rows[i].cells[j].textContent.toUpperCase()

            if(j == 0) {
                let nomeCompleto = conteudoCelula.split(" ")
                for(let k = 0; k < nomeCompleto.length; k++){
                    if(nomeCompleto[k].startsWith(termo)){
                        encontrou = true
                        break loopCell
                    }
                }
            } else {
                if(conteudoCelula.startsWith(termo)){
                    encontrou = true
                    break
                }
            } 
        }
        if(!encontrou)
            tabela.rows[i].style.display = "none"
    }
}

function menuAside(){
    let aside = document.querySelector("aside")
    let header = document.querySelector("header")
    let main = document.querySelector("main")
    if(aside.style.display == "flex"){
        aside.style.display = "none"
        header.style = "grid-column: 1/3;"
        main.style = "grid-column: 1/3;"
    }else{
        aside.style.display = "flex"
        header.style = "grid-column: 2/3;"
        main.style = "grid-column: 2/3;"
    }
}

function menuCards(){
    let cards = document.querySelector("div.cards")
    if(cards.style.display == "flex")
        cards.style.display = "none"
    else
        cards.style.display = "flex"
}

function mudouTamanho(){
    let aside = document.querySelector("aside")
    let header = document.querySelector("header")
    let main = document.querySelector("main")
    let cards = document.querySelector("div.cards")
    if(window.innerWidth < 600){
        aside.style.display = "none"
        header.style = "grid-column: 1/3;"
        main.style = "grid-column: 1/3;"
        cards.style.display = "none"
    }else{
        aside.style.display = ""
        header.style = "grid-column: 2/3;"
        main.style = "grid-column: 2/3;"
        cards.style.display = "flex"
    }
}

let validaRepeticaoNome = (cadastros, fnome) => {
    for(let i = 0; i < cadastros.length; i++){
        if(cadastros[i].nome == fnome)
            return true
    }
    return false
}

let validaRepeticaoEmail = (users, femail) => {
    for(let i = 0; i < users.length; i++){
        if(users[i].email == femail)
            return true
    }
    return false
}

let validaEmail = (femail) =>{
    if(!((/^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(femail)))                //Verifica se o email inserido é valido
        return false
    return true
}

let validaLogin = (users, femail, fsenha) => {
    for(let i = 0; i < users.length; i++){
        if((users[i].email == femail) && (users[i].senha == fsenha)){
            sessionStorage.setItem("Logado", users[i].nome)
            return true
        }
    }
    return false
}

function carregarUsers(){
    let users = JSON.parse(localStorage.getItem("Usuarios"))    //Busca a lista de usuários do sistema
    if(users == null)                                           //Se não existir lista de usuários, cria ela
        localStorage.setItem("Usuarios", JSON.stringify([{"email":"luciano@gmail.com","senha":"123","nome":"Luciano Henrique"}])) //User padrão
    return users
}

function criarConta(){
    let formData = new FormData(document.forms.formCadastro)
    let users = carregarUsers()

    let femail = formData.get("email")
    if(femail == ""){                                                                  //Verifica se o campo de email está vazio
        window.alert("Você deve fornecer um email para criar a conta")
        return false
    } else if(validaRepeticaoEmail(users, femail)){                                    //Verifica se já existe uma conta com esse email no sistema
        window.alert("Uma conta com esse email já está cadastrada no sistema")
        return false
    } else if(!validaEmail(femail)){                                                   //Verifica se o email inserido é valido
        window.alert("Email inválido, tente cadastrar outro")
        return false
    }

    let fsenha = formData.get("senha")
    if(fsenha == ""){                                                                  //Verifica se o campo de senha está vazio
        window.alert("Você deve fornecer uma senha para criar a conta")
        return false
    }

    let fnome = formData.get("nome")
    if(fnome == ""){
        window.alert("Você precisa fornecer um nome de usuário para exibição")
        return false
    }

    let novaConta = {email: femail, senha: fsenha, nome: fnome}
    users.push(novaConta)
    localStorage.setItem("Usuarios", JSON.stringify(users))

    setTimeout(() => window.location.replace("./login.html"))
}

function login(){
    let formData = new FormData(document.forms.formLogin)
    let users = carregarUsers()

    let femail = formData.get("email")                              
    if(femail == ""){                                               //Verifica se o campo de email está vazio
        window.alert("Você deve fornecer um email para o login!")
        return false
    } else if(!validaRepeticaoEmail(users, femail)){                //Verifica se o email informado existe no sistema
        window.alert("Email não encontrado no sistema!")
        return false
    }

    let fsenha = formData.get("senha")
    if(fsenha == ""){                                               //Verifica se o campo de senha está vazio
        window.alert("Você deve fornecer uma senha para o login!")
        return false
    }else if(!validaLogin(users, femail, fsenha)){                  //Valida se o email e senha informado pertencem ao mesmo usuário
        window.alert("Senha incorreta, tente novamente")
        return false
    }
    setTimeout(() => window.location.replace("./home.html"))
}

function carregarCadastros(){
    let cadastros = JSON.parse(localStorage.getItem("Cadastros"))   //Busca a lista de cadastros no sistema
    if(cadastros == null)                                           //Se não existir lista de cadastros, cria ela
        localStorage.setItem("Cadastros", "[]")
    let rev = 0

    let tabela = document.querySelector("tbody")             //Encontra a tabela na página
    cadastros.forEach(cadastro => {
        let user = cadastro

        let nome = document.createElement("td")
        nome.append(user.nome)

        let email = document.createElement("td")
        email.append(user.email)

        let ativo = document.createElement("td")
        
        if(!user.ativo){
            ativo.className = "inativo"
            ativo.append("Inativo")
            rev++
        }else
            ativo.append("Ativo")

        let linha = document.createElement("tr")
        linha.append(nome, email, ativo)

        linha.addEventListener('click', setCad)

        tabela.append(linha)
    })
    localStorage.setItem("Rev", rev)
}

function carregarCards(){
    let card = document.querySelectorAll("div.card")
    let cadastros = JSON.parse(localStorage.getItem("Cadastros"))
    let mes = sessionStorage.getItem("Mes")
    if(!mes)
        mes = 0
    let rev = localStorage.getItem("Rev")

    let totalCard = document.createElement("section")
    totalCard.innerHTML = cadastros.length
    totalCard.id = "total"
    card[0].prepend(totalCard)

    let mesCard = document.createElement("section")
    mesCard.innerHTML = mes
    mesCard.id = "mês"
    card[1].prepend(mesCard)

    let revCard = document.createElement("section")
    revCard.innerHTML = rev
    revCard.id = "rev"
    card[2].prepend(revCard)
}

function cadastrar(){
    let formData = new FormData(document.forms.formCadastro)
    let cadastros = JSON.parse(localStorage.getItem("Cadastros"))

    let mes = sessionStorage.getItem("Mes")

    let fnome = formData.get("nome")
    if(fnome == ""){                                                        //Lida com campo de nome vazio
        window.alert("Você precisa fornecer um nome para o cadastro!")
        return false
    } else if(validaRepeticaoNome(cadastros, fnome)){                       //Verifica se o nome é repetido
        window.alert("Esse nome já está registrado no sistema!")
        return false
    }                                                                     
    let femail = formData.get("email")
    if(femail == ""){                                                       //Lida com o campo de email vazio
        window.alert("Você deve fornecer um email para o cadastro")
        return false
    }else if(validaRepeticaoEmail(cadastros, femail)){                      //Verifica se o email é repetido
        window.alert("Uma conta com esse email já existe")
        return false
    }
    else if(!validaEmail(femail)){                                                       //Verifica se o email inserido é valido
        window.alert("Email inválido, tente cadastrar outro")
        return false
    }

    let fidade = formData.get("idade")
    if(fidade != ""){                                                       //Se o campo de idade não estiver vazio uma validação é realizada
        if(isNaN(fidade)){                                                  //Verifica se o valor inserido é numérico
            window.alert("A idade deve ser um número!")
            return false
        } else if(fidade < 18 || fidade > 100){                             //Verifica se a idade inserida está dentro dos limites esperados
            window.alert("Somente pessoas entre 18 e 100 anos podem ser cadastradas no sistema")
            return false
        }
    }

    let fendereco = formData.get("endereco")
    let finfo = formData.get("info")
    let finter = formData.get("inter")
    let fsenti = formData.get("senti")
    let fvalor = formData.get("valor")
    let iativo = document.querySelector("input#iativo").checked      //Tratamento especial ao checkbox

    let novoCadastro = {nome: fnome, idade: fidade, email: femail, endereco: fendereco, info: finfo, ativo: iativo, inter: finter, senti: fsenti, valor: fvalor}
    cadastros.push(novoCadastro)
    localStorage.setItem("Cadastros", JSON.stringify(cadastros))
    mes++
    sessionStorage.setItem("Mes", mes)

    setTimeout(() => window.location.replace("./home.html"))
}

function setCad(){
    sessionStorage.setItem("CadNome", this.children[0].innerHTML)
    sessionStorage.setItem("CadEmail", this.children[1].innerHTML)
    window.location.href = "./editarCadastro.html"
}

function getCad(){
    let cadastros = JSON.parse(localStorage.getItem("Cadastros"))           //Busca a lista de cadastros no sistema
    let editavel                                                            //Cadastrado que vai ser editado
    cadastros.forEach(cadastro => {
        if(cadastro.nome == sessionStorage.getItem("CadNome"))
            editavel = cadastro
    });

    const { elements } = document.querySelector('form')                     //Recebe todos os elementos do formulário

    for(const [key, value] of Object.entries(editavel)){                    //Retorna as chaves e valores do usuario que será editado
        const field = elements.namedItem(key)                       //Recebe os campos do formulário que tem o mesmo nome dos valores dos atributos do colaborador a ser editado
        field.value = value                                                 //Atribui os valores do colaborador aos campos do formulario
    }

    document.querySelector("input#iativo").checked = editavel.ativo  //O input checkbox possui comportamento diferente e portanto deve ser tratado diferentemente
}

function editar(){
    let formData = new FormData(document.forms.formCadastro)
    let cadastros = JSON.parse(localStorage.getItem("Cadastros"))
    let CadNome = sessionStorage.getItem("CadNome")
    let CadEmail = sessionStorage.getItem("CadEmail")

    let fnome = formData.get("nome")
    if(fnome == ""){                                                                        //Lida com campo de nome vazio
        window.alert("Você precisa fornecer um nome para a edição!")
        return false
    } else if(validaRepeticaoNome(cadastros, fnome) && fnome != CadNome){                   //Verifica se o nome é repetido e diferente do colaborador sendo editado
        window.alert("Esse nome já está registrado no sistema!")
        return false
    }                                                                     
    let femail = formData.get("email")
    if(femail == ""){                                                                       //Lida com o campo de email vazio
        window.alert("Você deve fornecer um email para o cadastro")
        return false
    }else if(validaRepeticaoEmail(cadastros, femail) && femail != CadEmail){                //Verifica se o email é repetido e diferente do colaborador sendo editado
        window.alert("Uma conta com esse email já existe")
        return false
    }
    else if(!validaEmail(femail)){                                                                       //Verifica se o email inserido é valido
        window.alert("Email inválido, tente cadastrar outro")
        return false
    }

    let fidade = formData.get("idade")
    if(fidade != ""){                                                                       //Se o campo de idade não estiver vazio uma 
        if(isNaN(fidade)){                                                                  //Verifica se o valor inserido é numérico
            window.alert("A idade deve ser um número!")
            return false
        } else if(fidade < 18 || fidade > 100){                                             //Verifica se a idade inserida está dentro dos limites esperados
            window.alert("Somente pessoas entre 18 e 100 anos podem ser cadastradas no sistema")
            return false
        }
    }

    let fendereco = formData.get("endereco")
    let finfo = formData.get("info")
    let finter = formData.get("inter")
    let fsenti = formData.get("senti")
    let fvalor = formData.get("valor")
    let iativo = document.querySelector("input#iativo").checked

    let cadAtualizado = {nome: fnome, idade: fidade, email: femail, endereco: fendereco, info: finfo, ativo: iativo, inter: finter, senti: fsenti, valor: fvalor}
    
    for(let i = 0; i < cadastros.length; i++){
        if(cadastros[i].nome == sessionStorage.getItem("CadNome"))
            cadastros[i] = cadAtualizado
    };

    localStorage.setItem("Cadastros", JSON.stringify(cadastros))

    setTimeout(() => window.location.replace("./home.html"))
}

function excluir(){
    let mes = sessionStorage.getItem("Mes")
    let cadastros = JSON.parse(localStorage.getItem("Cadastros"))
    for(let i = 0; i < cadastros.length; i++){
        if(cadastros[i].nome == sessionStorage.getItem("CadNome")){
            if((cadastros.length - i) <= mes && mes > 0){
                mes--
                sessionStorage.setItem("Mes", mes)
            }
            cadastros.splice(i, 1)
        }
    }
    
    localStorage.setItem("Cadastros", JSON.stringify(cadastros))

    setTimeout(() => window.location.replace("./home.html"))
}