const form = document.getElementById("ticketForm");
const ticketList = document.getElementById("ticketList");
const searchInput = document.getElementById("searchInput");

let allTickets = [];

async function loadTickets() {

    const res = await fetch("/tickets");
    const tickets = await res.json();

    allTickets = tickets;

    displayTickets(tickets);
    updateDashboard(tickets);
}

function updateDashboard(tickets) {

    document.getElementById("totalTickets").innerText = tickets.length;

    const openTickets = tickets.filter(
        ticket => ticket.status === "Open"
    ).length;
  const resolvedTickets = tickets.filter(
        ticket => ticket.status === "Resolved"
    ).length;

    document.getElementById("openTickets").innerText = openTickets;
    document.getElementById("resolvedTickets").innerText = resolvedTickets;
}
function displayTickets(tickets) {

    ticketList.innerHTML = "";

    tickets.reverse().forEach(ticket => {

        let priorityClass = "priority-low";

        if (ticket.priority === "Medium") {
            priorityClass = "priority-medium";
        }

        if (ticket.priority === "High") {
            priorityClass = "priority-high";
        }

        ticketList.innerHTML += `

            <div class="ticket">

                <h3>${ticket.title}</h3>

                <p>${ticket.description}</p>

                <p>
                 Priority:
                    <span class="${priorityClass}">
                        ${ticket.priority}
                    </span>
                </p>

                <p class="status">
                    Status: ${ticket.status}
                </p>

                <div class="ticket-buttons">

                    <button
                        class="resolve-btn"
                        onclick="resolveTicket('${ticket._id}')"
                    >
                        Resolve
                    </button>
                     <button
                        class="delete-btn"
                        onclick="deleteTicket('${ticket._id}')"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;
    });
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const ticket = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        priority: document.getElementById("priority").value
    };

    await fetch("/create-ticket", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
         body: JSON.stringify(ticket)
    });

    form.reset();

    loadTickets();
});

async function resolveTicket(id) {

    await fetch(`/update-ticket/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "Resolved"
        })
    });

    loadTickets();
}
async function deleteTicket(id) {

    await fetch(`/delete-ticket/${id}`, {
        method: "DELETE"
    });

    loadTickets();
}

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    const filteredTickets = allTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(value)
    );

    displayTickets(filteredTickets);
});

loadTickets();