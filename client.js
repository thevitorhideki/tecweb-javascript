const axios = require("axios");

function isPrime(number) {
  if (number <= 1) return false;

  if (number === 2) return true;

  if (number % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(number); i += 2) {
    if (number % i === 0) return false;
  }

  return true;
}

const getToken = async () => {
  const { data } = await axios.post(
    "https://tecweb-js.insper-comp.com.br/token",
    {
      username: "vitorhpk",
    },
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
  );

  return data.accessToken;
};

const getExercicios = async () => {
  const accessToken = await getToken();

  const { data } = await axios.get("https://tecweb-js.insper-comp.com.br/exercicio", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  Object.keys(data).forEach(async (slug) => {
    console.log(slug);
    console.log(data[slug]);
    const exercicio = data[slug];
    const entrada = exercicio["entrada"];
    if (slug === "soma") {
      const soma = entrada["a"] + entrada["b"];
      await submit(slug, soma, accessToken);
    } else if (slug === "tamanho-string") {
      const tamanho = entrada.string.length;
      await submit(slug, tamanho, accessToken);
    } else if (slug === "nome-do-usuario") {
      const email = entrada["email"];
      const name = email.split("@")[0];
      await submit(slug, name, accessToken);
    } else if (slug === "jaca-wars") {
      const v = entrada["v"];
      const theta = entrada["theta"];
      const distancia = (v ** 2 * Math.sin((2 * theta * Math.PI) / 180)) / 9.8;
      let resposta = -1;

      if (distancia >= 98 && distancia <= 102) {
        resposta = 0;
      } else if (distancia > 102) {
        resposta = 1;
      }

      await submit(slug, resposta, accessToken);
    } else if (slug === "ano-bissexto") {
      const ano = entrada["ano"];
      let ehBissexto = true;

      if (ano % 4 != 0) {
        ehBissexto = false;
      } else if (ano % 4 === 0 && ano % 100 === 0 && !(ano % 400 === 0)) {
        ehBissexto = false;
      }

      await submit(slug, ehBissexto, accessToken);
    } else if (slug === "volume-da-pizza") {
      const z = entrada["z"];
      const a = entrada["a"];

      const volume = Math.round(Math.PI * z ** 2 * a);

      await submit(slug, volume, accessToken);
    } else if (slug === "mru") {
      const s0 = entrada["s0"];
      const v = entrada["v"];
      const t = entrada["t"];

      const posicao = s0 + v * t;

      await submit(slug, posicao, accessToken);
    } else if (slug === "inverte-string") {
      const string = entrada["string"];
      let invertida = "";

      for (let i = string.length - 1; i >= 0; i--) {
        invertida += string[i];
      }

      await submit(slug, invertida, accessToken);
    } else if (slug === "soma-valores") {
      const objeto = entrada["objeto"];
      let soma = 0;

      Object.keys(objeto).forEach((k) => {
        soma += objeto[k];
      });

      await submit(slug, soma, accessToken);
    } else if (slug === "n-esimo-primo") {
      let n = entrada["n"];
      let primo = 1;

      while (n != 0) {
        primo++;
        if (isPrime(primo)) {
          n--;
        }
      }

      await submit(slug, primo, accessToken);
    } else if (slug === "maior-prefixo-comum") {
      const strings = entrada["strings"];
      let prefixosComuns = [""];

      for (let i = 0; i < strings.length - 2; i += 2) {
        const string1 = strings[i];
        const string2 = strings[i + 1];

        if (string1.length >= string2.length) {
          for (let j = 1; j <= string2.length; j++) {
            let prefix = string1.slice(0, j);

            if (!string2.startsWith(prefix)) {
              prefixosComuns.push(prefix.slice(0, j - 1));
              break;
            }
          }
        } else {
          for (let j = 1; j <= string2.length; j++) {
            let prefix = string1.slice(0, j);

            if (!string2.startsWith(prefix)) {
              prefixosComuns.push(prefix.slice(0, j - 1));
              break;
            }
          }
        }
      }

      const maiorPrefixo = prefixosComuns.reduce((maior, atual) => (atual.length > maior.length ? atual : maior));

      await submit(slug, maiorPrefixo, accessToken);
    } else if (slug === "soma-segundo-maior-e-menor-numeros") {
      const numeros = entrada["numeros"];

      const numerosOrdenados = numeros.sort((a, b) => a - b);

      const soma = numerosOrdenados[1] + numerosOrdenados[numerosOrdenados.length - 2];

      await submit(slug, soma, accessToken);
    } else if (slug === "conta-palindromos") {
      const palavras = entrada["palavras"];
      let contador = 0;

      palavras.forEach((palavra) => {
        if (palavra === palavra.split("").reverse().join("")) {
          contador++;
        }
      });

      await submit(slug, contador, accessToken);
    } else if (slug === "soma-de-strings-de-ints") {
      const strings = entrada["strings"];
      let soma = 0;

      strings.forEach((string) => {
        soma += parseInt(string);
      });

      await submit(slug, soma, accessToken);
    } else if (slug === "soma-com-requisicoes") {
      const endpoints = entrada["endpoints"];
      let soma = 0;

      try {
        const requests = endpoints.map((endpoint) =>
          axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
        );

        const responses = await Promise.all(requests);

        responses.forEach((response) => (soma += response.data));

        await submit(slug, soma, accessToken);
      } catch (error) {
        throw new Error(error);
      }
    } else if (slug === "caca-ao-tesouro") {
      let endpoint = entrada["inicio"];

      while (typeof endpoint !== "number") {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        endpoint = response.data;
      }

      await submit(slug, endpoint, accessToken);
    }
  });
};

const submit = async (slug, answer, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const body = {
    resposta: answer,
  };

  await axios.post(`https://tecweb-js.insper-comp.com.br/exercicio/${slug}`, body, { headers }).then((response) => {
    console.log({
      exercicio: slug,
      sucesso: response.data.sucesso,
    });
  });
};

getExercicios();
