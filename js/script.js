const ApiKey = "5dfb06da839d4118a672a166e0d70c6f";
const baseUrl = "https://api.football-data.org/v2/";
const leagueId = "2021";
const baseEndPoin = `${baseUrl}competitions/${leagueId}`;
const teamEndPoin = `${baseUrl}competitions/${leagueId}/teams`;
const standingEndPoin = `${baseUrl}competitions/${leagueId}/standings`;
const matchEndPoin = `${baseUrl}competitions/${leagueId}/matches`;

const contents = document.querySelector("#content-list");
const title = document.querySelector(".card-title");
const showModal = document.querySelector(".modal");

const fetchHeader = {
    headers:{
        'X-Auth-Token' : ApiKey
    }
}

function getListTeams(){
    title.innerHTML = "Daftar Tim Liga Primer Inggris";
    fetch(teamEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson=> {
            console.log(resJson.teams);
            let teams ="";
            resJson.teams.forEach(team=>{
                teams +=`
                <li class="collection-item avatar">
                    <img src="${team.crestUrl}" alt="" class="circle">
                    <span class="title">${team.name}</span>
                    <p>Berdiri : ${team.founded}<br>
                       Markas : ${team.venue}
                    </p>
                    <a href="#modal1" data-id="${team.id}" class="secondary-content modal-trigger"><i class="material-icons" data-id="${team.id}">info</i></a>
                </li>
                `
            });
            contents.innerHTML = '<ul class="collection">' + teams + '</ul>'
            const detil = document.querySelectorAll('.secondary-content');
            detil.forEach(btn=>{
                btn.onclick=(event)=>{
                    showTeamInfo(baseUrl + "teams/" + event.target.dataset.id);
                }
            })
        }).catch(err =>{
            console.error(err);
        })
}

function showTeamInfo(id){
    // let url = baseUrl + "teams/" + id;
    // contents.innerHTML = "Ini adalah informasi detail dari tim dengan ID " + id
    fetch(id,fetchHeader)
		.then(response => response.json())
		.then(resJson=>{
			showModal.innerHTML= `
                </div>
                        <div class="modal-content">
                            <center><h4><b>${resJson.name}</b></h4></center>
                                    Asal Negara : ${resJson.area.name}<br>
                                    Markas : ${resJson.venue} <br>
                                    Seragam : ${resJson.clubColors} <br>
                                    Berdiri : ${resJson.founded} <br>
                                    Alamat : ${resJson.address} <br>
                                    No. Telp : ${resJson.phone}<br>
                                    Website : ${resJson.website}<br>
									E-mail : ${resJson.email}<br>
                        </div>
                        <div class="modal-footer">
                        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
						</div>
				`
			}).catch(err=>{
				console.error(err);
			})
}


function getListStanding(){
    title.innerHTML = "Klasemen Sementar Liga Primer Inggris";
    fetch(standingEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson=> {
            console.log(resJson.standings[0]);
            let teams ="";
            let i = 1;
            resJson.standings[0].table.forEach(team=>{
                teams +=  `
                <tr>
                    <td style="padding-left:10px;">${i}</td>
                    <td><img src="${team.team.crestUrl}" alt="${team.team.name}" width="30px" ></td>
                    <td>${team.team.name}</td>
                    <td>${team.playedGames}</td>
                    <td>${team.won}</td>
                    <td>${team.draw}</td>
                    <td>${team.lost}</td>
                    <td>${team.points}</td>
                </tr> 
                `;
                i++;
            });
            contents.innerHTML = `
                <div class ="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th></th>
                            <th>Nama Tim</th>
                            <th>PG</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                        </thead>
                        <tbody>
                            ${teams}
                        </tbody>
                    </table>
                </div>
                `
        }).catch(err =>{
            console.error(err);
        })
}

function getListMatches(){
    title.innerHTML = "Jadwal Pertandingan Liga Primer Inggris";
    fetch(matchEndPoin, fetchHeader)
        .then(response => response.json())
        .then(resJson=> {
            console.log(resJson.matches);
            let matchs ="";
            let i = 1;
            resJson.matches.forEach(match=>{
                let d = new Date(match.utcDate).toLocaleDateString("id");
                let scoreHomeTeam = (match.score.fullTime.homeTeam==null?0:match.score.fullTime.homeTeam);   
                let scoreAwayTeam = (match.score.fullTime.awayTeam==null?0:match.score.fullTime.awayTeam);   
                matchs +=  `
                <tr>
                    <td style="padding-left:10px;">${i}</td>
                    <td>${match.homeTeam.name} vs ${match.awayTeam.name}</td>
                    <td>${d}</td>
                    <td>${scoreHomeTeam}:${scoreAwayTeam}</td>
                </tr> 
                `;
                i++;
            });
            contents.innerHTML = `
                <div class ="card">
                    <table class="stripped responsive-table">
                        <thead>
                            <th></th>
                            <th>Peserta</th>
                            <th>Tanggal</th>
                            <th>Skor Akhir</th>
                        </thead>
                        <tbody>
                            ${matchs}
                        </tbody>
                    </table>
                </div>
                `
        }).catch(err =>{
            console.error(err);
        })
}

function loadPage(page){
    switch(page){
        case "teams":
            getListTeams();
            break;
        case "standings":
            getListStanding();
            break;
        case "matches":
            getListMatches();
            break;
    }
}

document.addEventListener('DOMContentLoaded', function(){
    var elems = document.querySelector('.sidenav');
    var instances = M.Sidenav.init(elems);

    document.querySelectorAll(".sidenav a, .topnav a").forEach(elm =>{
        elm.addEventListener("Click", evt=>{
            let.sideNav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sideNav).close();
            page = evt.target.getAttribute("href").substr(1);
            loadPage(page);
        })

    })

    
    var page = window.location.hash.substr(1);
    if(page ===""|| page ==="!") page = "teams";

    var modal = document.querySelectorAll('.modal');
    M.Modal.init(modal);
    loadPage(page);
    
    //getListTeams();
});