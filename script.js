const body = document.querySelector("body");
const containerMovies = document.querySelector(".movies");
const bntPrev = document.querySelector(".btn-prev");
const bntNext = document.querySelector(".btn-next");
const input = document.querySelector(".input");
const modal = document.querySelector(".modal");

/*

MUDANÇA DE TEMA

*/
const themeButton = document.querySelector(".btn-theme");

let temaAtual = localStorage.getItem("tema");
trocarTema();

themeButton.addEventListener("click", () => {
    localStorage.setItem("tema", temaAtual === "claro" ? "escuro" : "claro");
    temaAtual = localStorage.getItem("tema");

    trocarTema();
});

function trocarTema() {
    themeButton.src = temaAtual === "claro" ? "./assets/light-mode.svg" : "./assets/dark-mode.svg";
    body.style.setProperty("--cor-background", temaAtual === "claro" ? "white" : "#242424");
    body.style.setProperty("--cor-texto", temaAtual === "claro" ? "black" : "white");
    body.style.setProperty(
        "--box-shadow",
        temaAtual === "claro" ? "0px 5px 11px 0px rgba(0,0,0,0.2)" : "0px 5px 11px 0px rgba(255,255,255,0.2)"
    );
    body.style.setProperty(
        "--cor-background-hightlight",
        temaAtual === "claro" ? "white" : "rgba(255, 255, 255, 0.212)"
    );
    bntPrev.src =
        temaAtual === "claro" ? "./assets/seta-esquerda-preta.svg" : "./assets/seta-esquerda-branca.svg";
    bntNext.src =
        temaAtual === "claro" ? "./assets/seta-direita-preta.svg" : "./assets/seta-direita-branca.svg";
}
/*

MUDANÇA DE TEMA

*/

let filmeAtual = 0;
let paginas;

function carrocelInicial() {
    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false")
        .then((response) => {
            return response.json();
        })
        .then((responseFormat) => {
            console.log(responseFormat);
            // paginas = organizarPaginas(responseFormat)

            filmeAtual = 0;
            paginas = responseFormat.results;

            preencherCarrocel();

            bntPrev.addEventListener("click", () => {
                cliquePrev(paginas);
            });

            bntNext.addEventListener("click", () => {
                cliqueNext(paginas);
            });
        });
}

carrocelInicial();

input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const pesquisado = input.value;

    if (pesquisado === "" || pesquisado === " ") {
        limparElementosFilhos(containerMovies);
        carrocelInicial();
        return;
    }

    fetch(
        "https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=" +
            pesquisado
    )
        .then((response) => {
            return response.json();
        })
        .then((responseFormat) => {
            limparElementosFilhos(containerMovies);
            if (responseFormat.results.length === 0) {
                const mensagemErro = document.createElement("span");
                mensagemErro.classList.add("mensagemErro");
                mensagemErro.textContent = "Não foi encontrado nenhum filme com esse nome";
                containerMovies.append(mensagemErro);
                return;
            }

            filmeAtual = 0;
            paginas = responseFormat.results;
            preencherCarrocel();
            input.value = "";
        });
});

const hightlightVideoLink = document.querySelector(".highlight__video-link");
const hightlightVideo = document.querySelector(".highlight__video");
const hightlightTitle = document.querySelector(".highlight__title");
const hightlightRating = document.querySelector(".highlight__rating");
const hightlightGenres = document.querySelector(".highlight__genres");
const hightlightLaunch = document.querySelector(".highlight__launch");
const hightlightDescription = document.querySelector(".highlight__description");

fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR")
    .then((response) => {
        return response.json();
    })
    .then((responseFormat) => {
        console.log(responseFormat);

        const genres = [];
        responseFormat.genres.forEach((item) => {
            genres.push(item.name);
        });

        const data = new Date(responseFormat.release_date);
        const dataOptions = { year: "numeric", month: "long", day: "2-digit" };

        hightlightVideo.style.backgroundImage = `url(${responseFormat.backdrop_path})`;
        hightlightTitle.textContent = responseFormat.title;
        hightlightRating.textContent = responseFormat.vote_average;
        hightlightGenres.textContent = genres.join(", ");
        hightlightLaunch.textContent = data.toLocaleDateString("pt-BR", dataOptions);
        hightlightDescription.textContent = responseFormat.overview;
    });

fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR")
    .then((response) => {
        console.log(response);
        return response.json();
    })
    .then((responseFormat) => {
        console.log(responseFormat);

        const item = responseFormat.results[0];

        hightlightVideoLink.href = "https://www.youtube.com/watch?v=" + item.key;
    });

function preencherCarrocel() {
    for (let i = filmeAtual; i < filmeAtual + 5; i++) {
        let filmeAtual = i;
        if (filmeAtual >= paginas.length) filmeAtual = i - paginas.length;
        console.log(filmeAtual);
        const movie = document.createElement("div");
        movie.classList.add("movie");
        movie.id = paginas[filmeAtual].id;
        const movieInfo = document.createElement("div");
        movieInfo.classList.add("movie__info");
        const movieTitle = document.createElement("span");
        movieTitle.classList.add("movie__title");
        const movieRating = document.createElement("span");
        movieRating.classList.add("movie__rating");
        const img = document.createElement("img");
        const nota = document.createElement("span");
        nota.classList.add("nota");

        movie.style.backgroundImage = `url(${paginas[filmeAtual].poster_path})`;

        movieTitle.textContent = paginas[filmeAtual].title;
        img.src = "./assets/estrela.svg";
        nota.textContent = paginas[filmeAtual].price;

        containerMovies.append(movie);
        movie.append(movieInfo);
        movieInfo.append(movieTitle, movieRating);
        movieRating.append(img, nota);
    }

    /*
     MODAL
     */

    const modalTitle = document.querySelector(".modal__title");
    const modalImg = document.querySelector(".modal__img");
    const modalDescription = document.querySelector(".modal__description");
    const modalGenres = document.querySelector(".modal__genres");
    const modalAverage = document.querySelector(".modal__average");

    const movies = document.querySelectorAll(".movie");
    movies.forEach((movie) => {
        movie.addEventListener("click", () => {
            body.style.overflow = "hidden";
            modalGenres.textContent = "";

            fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movie.id}?language=pt-BR`)
                .then((response) => response.json())
                .then((responseFormat) => {
                    console.log("movie info", responseFormat);
                    responseFormat.genres.forEach((genero, index) => {
                        const span = document.createElement("span");
                        span.classList.add("genero");
                        if (index !== responseFormat.genres.length - 1) {
                            span.classList.add("mr-12");
                        }
                        span.textContent = genero.name;
                        modalGenres.append(span);
                    });
                    modalTitle.textContent = responseFormat.title;
                    modalImg.src = responseFormat.backdrop_path;
                    modalDescription.textContent = responseFormat.overview;
                    modalAverage.textContent = responseFormat.vote_average;
                    setTimeout(() => {
                        modal.classList.remove("hidden");
                    }, 100);
                });
        });
    });
    modal.addEventListener("click", () => {
        modal.classList.add("hidden");
        body.style.overflow = "auto";
    });

    const modalClose = document.querySelector(".modal__close");
    modalClose.addEventListener("click", () => {
        modal.classList.add("hidden");
        body.style.overflow = "auto";
    });

    for (elem of modal.children) {
        elem.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }

    /*
     /MODAL
     */
}

function limparElementosFilhos(elementoPai) {
    const tamanhoElemento = elementoPai.children.length;
    for (let i = 0; i < tamanhoElemento; i++) {
        elementoPai.children[0].remove();
    }
}

function cliquePrev() {
    filmeAtual--;
    if (filmeAtual < 0) {
        filmeAtual = paginas.length - 1;
    }
    containerMovies.textContent = "";
    preencherCarrocel();
}

function cliqueNext() {
    filmeAtual++;
    if (filmeAtual >= paginas.length) {
        filmeAtual = 0;
    }
    containerMovies.textContent = "";
    preencherCarrocel();
}
