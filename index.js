const API_URL  = "https://api.github.com/users/";
const form  = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search");


const createErrorCard = (message)=>{
    const cardHTML = `<div class="card" > <h1>${message}</h1> </div>`
    main.innerHTML = cardHTML;
}

const createUserCard = (data)=>{
    const cardHTML = `
    <div class="card">
        <div class="profile">
            <img src="${data.avatar_url}" alt="${data.name}" class="avatar">
        </div>
        <div class="user-info">
            <h2>${data.name}</h2>
            <p>${data.bio}</p>
            <ul>
                <li>${data.followers}<strong>Follower</strong></li>
                <li>${data.following}<strong>Following</strong></li>
                <li>${data.public_repos}<strong>Repository</strong></li>
            </ul>
            <div class="repo" id="repos"></div>
        </div>
    </div>
    `;
    main.innerHTML = cardHTML;
}

const addReposCard = (repos)=>{
    const reposElement = document.getElementById("repos");
    repos.slice(0,2).forEach(repo => {
        const repoElement = document.createElement('a');
        repoElement.classList.add('repo');
        repoElement.href = repo.html_url;
        repoElement.target= "_blank";
        repoElement.innerText = repo.name;
        reposElement.appendChild(repoElement);
    });
}

const getRepos = async (username)=>{
    try{
        const {data} = await axios(API_URL+username+"/repos?sort=created");
        addReposCard(data);
    }
    catch{
        createErrorCard("User Not Found,Please Enter Correct Username");
    }
}

const getUser = async (username)=>{
    try{
        const {data} = await axios(API_URL+username);
        createUserCard(data);
        getRepos(username);
    }
    catch (error){
        if(error.response.status=400){
            createErrorCard("User Not Found,Please Enter Correct Username");
        }
    }
}

form.addEventListener('submit' , (e)=>{
    e.preventDefault();
    const user = search.value;
    if(user){
        getUser(user)
        search.value = ""
    }
})