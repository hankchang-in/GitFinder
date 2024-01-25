const API_URL  = "https://api.github.com/users/";
const form  = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search");
const repository = document.getElementById("repository");
const reposBio = document.getElementById("reposBio");

let globalData = null;

const createErrorCard = (message)=>{
    const cardHTML = `<div class="card" > <h1>${message}</h1> </div>`
    main.innerHTML = cardHTML;
}

const createUserCard = (data)=>{
    console.log(data)
    const cardHTML = `
    <div class="card">
        <div class="profile">
            <img src="${data.avatar_url}" alt="${data.name}" class="avatar">
        </div>
        <div class="user-info">
            <h2>${data.name}</h2>
            <p>${data.bio}</p>
            <p>${data.location}</p>
            <p>${data.twitter_username}</p>
            <ul>
                <li>${data.followers}<strong>Follower</strong></li>
                <li>${data.following}<strong>Following</strong></li>
                <li>${data.public_repos}<strong>Repository</strong></li>
            </ul>
            </div>
        </div>
    </div>
    `;
    main.innerHTML = cardHTML;
}



const addPagentation = (indxLength)=>{
    const pagentationCardElement = document.getElementById("pagentationCard");
    console.log(indxLength);
    pagentationCardElement.innerHTML = ""; // Clear previous repository pagentation

    
    for(let i = 0; i<indxLength ; i++){
        // console.log(indx + "v")
        
        const indxUlElement = document.createElement("ul");
        indxUlElement.classList.add("indxul");
        pagentationCardElement.appendChild(indxUlElement);


        pagentationCardElement.append(indxUlElement);
        const indxNumberElement = document.createElement("li");
        indxNumberElement.innerHTML = (i+1);
        indxUlElement.setAttribute("attr-number",i+1);
        addCustomEvent(indxUlElement)

        indxUlElement.appendChild(indxNumberElement);

    }
}

const addReposCard =  (repos,startIdx) => {
    const reposCardElement = document.getElementById("repoCard");
    reposCardElement.innerHTML = ""; // Clear previous repository cards
    console.log(startIdx);

    repos.slice(startIdx, startIdx+10).forEach(async(repo) => {
        const repoDivElement = document.createElement("div");
        repoDivElement.classList.add("reposInnerCard");
        reposCardElement.append(repoDivElement);

        //adding name of Repository

        const repoNameElement = document.createElement("h3");
        repoNameElement.classList.add("reposName");
        repoNameElement.innerHTML = repo.name;

        let language_url = repo.languages_url

        let tech = await getLanguages(language_url)
        // console.log(languages_url)
        let repoLanguageElement = document.createElement("div");
        repoLanguageElement.classList.add("reposLanguage");

        let repoLanguageUl = document.createElement("ul");
        repoLanguageUl.classList.add("reposLanguageUl");

        console.log(tech)
        
        for(var data in tech){
            let repoLanguageli = document.createElement("li");
            repoLanguageli.classList.add("reposLanguageLi");

            repoLanguageli.innerHTML = data;
            repoLanguageUl.appendChild(repoLanguageli)
        }
    

    repoLanguageElement.appendChild(repoLanguageUl)
        //adding description of Repository
        const repoBioElement = document.createElement("p");
        repoBioElement.classList.add("reposBio");
        if (repo.description) {
            repoBioElement.innerHTML = repo.description;
        } else {
            repoBioElement.innerHTML = "Bio is not available";
        }





        repoDivElement.appendChild(repoNameElement);
        repoDivElement.appendChild(repoBioElement);
        repoDivElement.appendChild(repoLanguageElement);
    });


};

const getLanguages = async(data)=>{
    try{
        let tech = await axios(data);
        // console.log({tech})
        return tech.data;
    }
    catch(err){
        console.log(err);
    }
}

const getIndex = async (username)=>{
    try{
        let {data} = await axios(API_URL+username+"/repos?sort=created")
        console.log(data)
        const indxLength = Math.ceil(data.length/10);
        console.log(indxLength);
        addPagentation(indxLength);

    }
    catch(err){
        console.log(err);
    }
}




const getRepos = async (username)=>{
    try{
        const {data} = await axios(API_URL+username+"/repos?sort=created");
        globalData = data;
        addReposCard(globalData,0);
        
    }
    catch(err){
        console.log(err);
        createErrorCard("No repos found");
    }
}

const getUser = async (username)=>{
    try{
       const {data} = await axios(API_URL+username);
        createUserCard(data);
        getRepos(username);
        getIndex(username);
    }
    catch (error){
        if(error.response.status=400){
            createErrorCard("User Not Found,Please Enter Correct Username");
        }
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();

    const user = search.value;
    if(user){
        getUser(user)
        // search.value = ""
    }
})


// $('body').onClick(".pagination li", (e) =>{
//     console.log(this)
// })
function addCustomEvent(doc){
doc.addEventListener("click", function(e){
    let start = e.target.getAttribute("attr-number")
    addReposCard(globalData,((start*10)-(10)));

});
}