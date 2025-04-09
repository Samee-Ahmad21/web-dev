document.addEventListener('DOMContentLoaded', function() {
    let wrapper = document.querySelector(".wrapper");
    let filtersContainer = document.querySelector(".filters");
  
    fetch("temples.csv")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
      })

      .then((csvText) => {
        let temples = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        }).data;
        renderTemples(temples);
        createReligionFilters();
      })
      .catch((error) => console.error("Error loading CSV:", error));
  
      function renderTemples(data) {
        wrapper.innerHTML = "";
        data.forEach((temple) => {
          if (!temple.name) return;
          
          // Create card container
          const card = document.createElement("div");
          card.className = "temple-card";
          card.dataset.religion = temple.religion?.toLowerCase().trim() || "";
          
          // Front side content (basic info)
          const front = document.createElement("div");
          front.className = "card-front";
          front.innerHTML = `
            <h3>${temple.name}</h3>
            <p>Religion: ${temple.religion || 'Unknown'}</p>
            ${temple.image ? `<img src="${temple.image.replace(/"/g, '')}" class="temple-image"/>` : ''}
            <div class="flip-button">More Details →</div>
          `;
          
          // Back side content (additional details)
          const back = document.createElement("div");
          back.className = "card-back";
          back.innerHTML = `
            <h3>${temple.name}</h3>
            <p><strong>Neighborhood:</strong> ${temple.neighborhood || 'Unknown'}</p>
            <p><strong>Town:</strong> ${temple.town || 'Unknown'}</p>
            <p><strong>Current Use:</strong> ${temple.current_use || 'Unknown'}</p>
            <p><strong>Status of Destruction:</strong> ${temple.status_of_destruction || 'Unknown'}</p>
            ${temple.map ? `
            <div class="map-container">
              <iframe 
                src="${temple.map.replace(/"/g, '')}" 
                class="temple-map"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            ` : ''}
            <div class="flip-button">← Back</div>
          `;
          
          // Assemble card
          card.appendChild(front);
          card.appendChild(back);
          wrapper.appendChild(card);
          
          // Add click handler for flipping
          card.addEventListener("click", function(e) {
            // Don't flip if clicking on map or flip button
            if (!e.target.classList.contains("flip-button") && 
                !e.target.closest(".temple-map")) {
              return;
            }
            this.classList.toggle("flipped");
          });
        });
      }
  
    function createReligionFilters() {
      filtersContainer.innerHTML = ""; // Clear existing filters
      
      // Add All button
      const allButton = document.createElement("button");
      allButton.textContent = "All";
      allButton.className = "filter-btn active";
      allButton.dataset.filter = "all";
      filtersContainer.appendChild(allButton);
  
      // Add religion buttons
      ["Hindu", "Sikh", "Jain"].forEach(religion => {
        const button = document.createElement("button");
        button.textContent = religion;
        button.className = "filter-btn";
        button.dataset.filter = religion.toLowerCase();
        filtersContainer.appendChild(button);
      });
  
      // Add event listeners
      filtersContainer.addEventListener("click", function(e) {
        if (!e.target.classList.contains("filter-btn")) return;
        
        document.querySelectorAll(".filter-btn").forEach(btn => 
          btn.classList.remove("active"));
        e.target.classList.add("active");
        
        const filter = e.target.dataset.filter;
        document.querySelectorAll(".temple-card").forEach(card => {
          card.style.display = (filter === "all" || card.dataset.religion === filter) 
            ? "block" 
            : "none";
        });
      });
    }
  });