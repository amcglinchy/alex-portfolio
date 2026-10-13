// import * as d3 from "d3";

/**
 * CONSTANTS AND GLOBALS
 */
// dimensions
const h = 600
const w = 800
const r = 60
const centerX = w / 2;
const centerY = h / 2;
const layoutRadius = 200;
const angleStep = (2 * Math.PI) / projects.length;
// margins
// svg
// containers
// positions


/**
 * APPLICATION STATE
 */
let state = {
    view: "overview",
    activeProject: null,
    rotation: 0,
    previousRotation: 0
};

init();

/**
 * LOAD DATA
 */
// We already have `projects` from projects.js,
// so this will be a little different from loading a CSV/JSON.


/**
 * INITIALIZE
 */
function init() {
    // create SVG
    svg = d3.select(".work-wheel")
            .append("svg")
            .attr("viewBox", window.innerWidth <= 700
                ? [100, 0, 600, 600]
                : [50, 0, 700, 600]);

    projectGroups = svg.selectAll(".project-group")
        .data(projects)
        .join(
            enter => enter.append("g")
                .attr("class", "project-group")
        );

    projectGroups
        .on("click", (event, d) => {
            const clickedIndex = projects.findIndex(project => project.id === d.id);

            const currentAngle =
                Math.PI + clickedIndex * angleStep + state.rotation;

            const rotationNeeded = Math.PI - currentAngle;
            const normalizedRotation =
                    Math.atan2(
                    Math.sin(rotationNeeded),
                    Math.cos(rotationNeeded)
                );

            state.previousRotation = state.rotation;
            state.rotation += normalizedRotation;
            state.activeProject = d.id;
            state.view = "detail";

            draw();  
        });

    projectGroups
        .append("circle")
        .attr("class", "project-aura")
        .attr("r", r + 15);

    projectGroups
        .append("circle")
        .attr("class", "project-circle")
        .attr("r", r);

projectGroups
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .each(function(d) {
        const text = d3.select(this);
        const words = d.shortTitle.split(" ");
        const maxChars = 14;
        const lines = [];
        let line = "";

        words.forEach(word => {
            const testLine = line ? `${line} ${word}` : word;

            if (testLine.length > maxChars && line) {
                lines.push(line);
                line = word;
            } else {
                line = testLine;
            }
        });

        if (line) lines.push(line);

        lines.forEach((line, i) => {
            text.append("tspan")
                .attr("x", 0)
                .attr("dy", i === 0 ? `${-(lines.length - 1) * 0.6}em` : "1.2em")
                .text(line);
        });
    });

    d3.select(".work-center")
        .style("cursor", "pointer")
        .on("click", () => {
            state.previousRotation = state.rotation;
            state.rotation = 0;
            state.activeProject = null;
            state.view = "overview";

            draw();
        });
    // Start all project circles behind the Work bubble
    projectGroups
        .attr("transform", `translate(${centerX}, ${centerY})`)
        .style("opacity", 0);

    // Animate the circles outward
    setTimeout(() => {
        projectGroups
            .transition()
            .duration(1000)
            .ease(d3.easeCubicOut)
            .style("opacity", 1)
            .attr("transform", (d, i) => {
                const position = getProjectPosition(i, 0);
                return `translate(${position.x}, ${position.y})`;
            });
    }, 700);
}

/**
 * GET PROJECT POSITION
 */
function getProjectPosition(i, rotation) {
    const angle = Math.PI + i * angleStep + rotation;

    const x = centerX + layoutRadius * Math.cos(angle);
    const y = centerY + layoutRadius * Math.sin(angle);

    return { x, y };
}

function updateProjectInfo(project) {
    d3.select(".work-project-kicker")
        .text(`${project.type} · ${project.year}`);

    d3.select(".work-project-title")
        .text(project.title);

    d3.select(".work-project-description")
        .text(project.description);

    d3.select(".work-project-tags")
        .selectAll("span")
        .data(project.tags)
        .join("span")
        .text(d => d);

    d3.select("#project-image")
        .attr("src", project.image)
        .attr("alt", `Preview of ${project.title}`);

    d3.select(".work-project-link")
    .attr("href", project.url);
}


/**
 * DRAW
 */
function draw() {

    d3.select(".work-project-layout")
    .classed("detail-view", state.view === "detail");

    const activeProject = projects.find(
        project => project.id === state.activeProject
    );

    projectGroups
    .select(".project-circle")
    .attr("r", d => {
        return d.id === state.activeProject ? 75 : r;
    })
    .classed("active", d => d.id === state.activeProject);

    projectGroups
        .select(".project-aura")
        .classed("active", d => d.id === state.activeProject);

    const interpolateRotation = d3.interpolateNumber(
        state.previousRotation,
        state.rotation
    );

    d3.transition()
        .duration(700)
        .tween("rotate", () => {
            return (t) => {
                const rotation = interpolateRotation(t);

                projectGroups
                    .attr("transform", (d, i) => {
                        const position = getProjectPosition(i, rotation);

                        return `translate(${position.x}, ${position.y})`;
                    });
            };
        })
.on("end", () => {
    if (activeProject) {
        updateProjectInfo(activeProject);
    }
});

}