// ---------------------------------
// WORK PAGE
// ---------------------------------

const workPage = document.querySelector(".work-page");

if (workPage && typeof d3 !== "undefined" && typeof projects !== "undefined") {

    // d3.select(".work-page")
    //     .selectAll(".d3-project")
    //     .data(projects)
    //     .enter()
    //     .append("a")
    //     .attr("class", function(d, i) {

    //         const angle = (2 * Math.PI / projects.length) * i;

    //         if (Math.cos(angle) > 0.1) {
    //             return "d3-project right";
    //         } else if (Math.cos(angle) < -0.1) {
    //             return "d3-project left";
    //         } else {
    //             return "d3-project vertical";
    //         }

    //     })
    //     .attr("href", function(d) {
    //         return d.url;
    //     })
    //     .html(function(d) {
    //         return `
    //             <span class="project-title">${d.shortTitle}</span>
    //             <span class="project-year">${d.year}</span>
    //         `;
    //     })
    //     .style("--x", function(d, i) {

    //         const angle = (2 * Math.PI / projects.length) * i;
    //         const radius = window.innerWidth <= 700 ? 135 : 220;

    //         return `${Math.cos(angle) * radius}px`;

    //     })
    //     .style("--y", function(d, i) {

    //         const angle = (2 * Math.PI / projects.length) * i;
    //         const radius = window.innerWidth <= 700 ? 135 : 220;    
    //         return `${Math.sin(angle) * radius}px`;

    //     });


    // setTimeout(function() {

    //     d3.selectAll(".d3-project")
    //         .style("transform", function() {
    //             return "translate(calc(-50% + var(--x)), calc(-50% + var(--y)))";
    //         })
    //         .style("opacity", 1);

    // }, 300);


    // d3.selectAll(".d3-project")
    //     .append("span")
    //     .attr("class", "project-description")
    //     .text(function(d) {
    //         return d.description;
    //     });

}


// ---------------------------------
// SITE MENU
// ---------------------------------

const menuButton = document.querySelector(".menu-button");
const menuNav = document.querySelector(".menu-nav");

if (menuButton && menuNav) {

    menuButton.addEventListener("click", function() {
        menuNav.classList.toggle("open");
    });

}

// ---------------------------------
// PROJECT METADATA
// ---------------------------------

// Project kicker
const projectKicker = document.querySelector("[data-project-type]");

if (projectKicker && typeof projects !== "undefined") {

    const projectId = projectKicker.dataset.projectType;

    const project = projects.find(function(project) {
        return project.id === projectId;
    });

    if (project) {
        projectKicker.textContent = `${project.type} · ${project.year}`;
    }

}

const projectMeta = document.querySelector(".project-meta[data-project]");

if (projectMeta && typeof projects !== "undefined") {

    const projectId = projectMeta.dataset.project;

    const project = projects.find(function(project) {
        return project.id === projectId;
    });

    if (project) {

        // Add project tags
        project.tags.forEach(function(tag) {
            const pill = document.createElement("span");
            pill.textContent = tag;
            projectMeta.appendChild(pill);
        });

    }

}