    const CATEGORY_SUBTAGS = {
      "Sample Library": ["Bass","Brass","Choir/Voices","Guitar","Harp","Keys/Pianos","Multi-instrument","Orchestral","Percussion/Drums","Strings","Textures/Atmospheres","Woodwinds","World/Ethnic"],
      "Effect Plugin": ["Amp Suite","Channel Strip","Compressor","Delay","EQ","Limiter","Mastering Suite","Metering/Analysis","Other Effects","Reverb","Saturation/Distortion"],
      "Synth": ["Analog/VA","Bass","Drums","Modular/Builder","Organ/Keys","Other Synth","Sampler/Workstation","Wavetable/Hybrid"],
      "Gear": ["Accessories","Audio Interface","DAW","Headphones","Microphone","MIDI Keyboard","Studio Monitors","Workstation"]
    };

    const collator = new Intl.Collator(undefined, { sensitivity: "base" });
    const compareText = (a, b) => collator.compare(a || "", b || "");

    const CSV_URL = "./gear-software.csv";
    const state = { q: "", category: "", vendor: "", sort: "recent", subtags: new Set() };

    const qEl = document.getElementById("q");
    const vendorSel = document.getElementById("vendor");
    const sortTop = document.getElementById("sortTop");
    const subtagsEl = document.getElementById("subtags");
    const catpillsEl = document.getElementById("catpills");
    const grid = document.getElementById("grid");
    const countEl = document.getElementById("count");
    const subtagsWrapEl = document.getElementById("subtagsWrap");

    let DB = [];

    function escapeHTML(s){
      return (s || "").replace(/[&<>\"']/g, m => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[m]));
    }

    function toMs(dateText){
      if(!dateText) return 0;
      const s = String(dateText).trim();
      const parts = s.split("/");
      if(parts.length === 3){
        const mm = parseInt(parts[0], 10);
        const dd = parseInt(parts[1], 10);
        const yy = parseInt(parts[2], 10);
        if(!Number.isNaN(mm) && !Number.isNaN(dd) && !Number.isNaN(yy)){
          const y = yy < 100 ? (2000 + yy) : yy;
          return new Date(y, mm - 1, dd).getTime() || 0;
        }
      }
      const t = Date.parse(s);
      return Number.isNaN(t) ? 0 : t;
    }

    function parseCSVRows(text){
      const rows = [];
      let row = [];
      let field = "";
      let inQuotes = false;

      for(let i = 0; i < text.length; i++){
        const ch = text[i];

        if(ch === "\""){
          if(inQuotes && text[i + 1] === "\""){
            field += "\"";
            i++;
          } else {
            inQuotes = !inQuotes;
          }
          continue;
        }

        if(ch === "," && !inQuotes){
          row.push(field);
          field = "";
          continue;
        }

        if((ch === "\n" || ch === "\r") && !inQuotes){
          if(ch === "\r" && text[i + 1] === "\n") i++;
          row.push(field);
          if(row.some(cell => String(cell).trim() !== "")) rows.push(row);
          row = [];
          field = "";
          continue;
        }

        field += ch;
      }

      if(field.length || row.length){
        row.push(field);
        if(row.some(cell => String(cell).trim() !== "")) rows.push(row);
      }

      return rows;
    }

    function splitVendorAndName(product){
      const match = String(product).match(/^(.*?)\s(?:—|–|â|-)\s(.+)$/);
      if(!match) return { vendor: "", name: String(product).trim() };
      return { vendor: match[1].trim(), name: match[2].trim() };
    }

    function buildDerived(item){
      const loweredSubtags = item.subtags.map(s => s.toLowerCase());
      return {
        ...item,
        dateMs: toMs(item.date),
        sortedSubtags: item.subtags.slice().sort(compareText),
        subtagsLowerSet: new Set(loweredSubtags),
        searchHaystack: (item.product + " " + item.vendor + " " + item.name + " " + item.description + " " + item.subtags.join(" ")).toLowerCase()
      };
    }

    function parseCSV(text){
      const rows = parseCSVRows(text);
      if(!rows.length) return [];

      const header = rows[0].map(h => String(h).trim());
      const idx = {
        product: header.findIndex(h => /product/i.test(h)),
        tag: header.findIndex(h => /^tag$/i.test(h)),
        desc: header.findIndex(h => /description/i.test(h)),
        subs: header.findIndex(h => /^subtags$/i.test(h)),
        date: header.findIndex(h => /^date$/i.test(h))
      };

      const items = [];
      for(let i = 1; i < rows.length; i++){
        const cols = rows[i];
        const first = String(cols[0] || "").trim().toLowerCase();
        const second = String(cols[1] || "").trim().toLowerCase();
        if(first === "product" && second === "tag") continue;

        const product = String(cols[idx.product] || "").trim();
        if(!product) continue;

        const tag = String(cols[idx.tag] || "").trim();
        const description = String(cols[idx.desc] || "").trim();
        const subsRaw = idx.subs >= 0 ? String(cols[idx.subs] || "").trim() : "";
        const date = idx.date >= 0 ? String(cols[idx.date] || "").trim() : "";
        const pair = splitVendorAndName(product);

        const subtags = subsRaw ? subsRaw.split(/[;|,]/).map(s => s.trim()).filter(Boolean) : [];

        items.push(buildDerived({ product, vendor: pair.vendor, name: pair.name, tag, description, subtags, date }));
      }
      return items;
    }

    async function loadCSVText(){
      const res = await fetch(CSV_URL);
      if(!res.ok) throw new Error(`Failed to load gear data: ${res.status}`);
      return res.text();
    }

    function debounce(fn, waitMs){
      let timerId = 0;
      return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), waitMs);
      };
    }

    function buildVendorOptions(){
      const vendorSet = new Set();
      DB.forEach(item => { if(item.vendor) vendorSet.add(item.vendor); });
      const vendors = Array.from(vendorSet).sort(compareText);

      const frag = document.createDocumentFragment();
      const defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = "All Vendors";
      frag.appendChild(defaultOpt);

      for(const vendor of vendors){
        const opt = document.createElement("option");
        opt.value = vendor;
        opt.textContent = vendor;
        frag.appendChild(opt);
      }

      vendorSel.replaceChildren(frag);
      vendorSel.value = state.vendor;
    }

    function buildCategoryPills(){
      const frag = document.createDocumentFragment();
      for(const category of Object.keys(CATEGORY_SUBTAGS)){
        const btn = document.createElement("button");
        btn.className = "pill";
        btn.type = "button";
        btn.textContent = category;
        btn.dataset.active = String(state.category === category);
        btn.setAttribute("aria-pressed", String(state.category === category));
        btn.addEventListener("click", () => {
          state.category = state.category === category ? "" : category;
          state.subtags.clear();
          buildCategoryPills();
          buildSubtags();
          render();
        });
        frag.appendChild(btn);
      }
      catpillsEl.replaceChildren(frag);
    }

    function buildSubtags(){
      const list = CATEGORY_SUBTAGS[state.category] || [];
      const frag = document.createDocumentFragment();

      for(const tag of list){
        const btn = document.createElement("button");
        btn.className = "pill";
        btn.type = "button";
        btn.textContent = tag;
        btn.dataset.active = String(state.subtags.has(tag));
        btn.setAttribute("aria-pressed", String(state.subtags.has(tag)));
        btn.addEventListener("click", () => {
          if(state.subtags.has(tag)) state.subtags.delete(tag);
          else state.subtags.add(tag);
          btn.dataset.active = String(state.subtags.has(tag));
          btn.setAttribute("aria-pressed", String(state.subtags.has(tag)));
          render();
        });
        frag.appendChild(btn);
      }

      subtagsEl.replaceChildren(frag);
      subtagsWrapEl.style.display = list.length ? "block" : "none";
    }

    function compareByName(a, b){
      return compareText(a.name, b.name) || compareText(a.vendor, b.vendor) || compareText(a.product, b.product);
    }

    const SORTERS = {
      recent: (a, b) => (b.dateMs - a.dateMs) || compareByName(a, b),
      oldest: (a, b) => (a.dateMs - b.dateMs) || compareByName(a, b),
      name: (a, b) => compareByName(a, b)
    };

    function match(item){
      if(state.category && item.tag !== state.category) return false;
      if(state.vendor && item.vendor !== state.vendor) return false;

      if(state.subtags.size){
        for(const selected of state.subtags){
          if(!item.subtagsLowerSet.has(selected.toLowerCase())) return false;
        }
      }

      if(state.q && !item.searchHaystack.includes(state.q)) return false;
      return true;
    }

    function card(item){
      const el = document.createElement("article");
      el.className = "card";
      el.setAttribute("role", "listitem");

      const tags = item.sortedSubtags;
      const dateHTML = item.date ? `<span class="date-added">Date Added: ${escapeHTML(item.date)}</span>` : "";

      el.innerHTML = `
        <div class="card-inner">
          <div>
            <div class="title">${escapeHTML(item.name)}</div>
            <div class="vendor">${escapeHTML(item.vendor)} &bull; ${escapeHTML(item.tag)}</div>
          </div>
          <div class="meta">
            ${tags.slice(0, 4).map(s => `<span class="tag">${escapeHTML(s)}</span>`).join("")}
          </div>
        </div>
        ${item.description ? `<div class="desc">${escapeHTML(item.description)}</div>` : ""}
        <div class="toolbar">
          ${tags.slice(4).map(s => `<span class="tag">${escapeHTML(s)}</span>`).join("")}
          ${dateHTML}
        </div>`;

      return el;
    }

    const PAGE_SIZE = 40;
    let currentList = [];
    let currentPage = 0;
    let ioObserver = null;
    const sentinel = document.createElement('div');
    sentinel.id = 'gs-sentinel';
    sentinel.style.cssText = 'height:1px;';

    function appendPage(){
      const start = currentPage * PAGE_SIZE;
      const slice = currentList.slice(start, start + PAGE_SIZE);

      if(!slice.length){
        if(currentPage === 0){
          const p = document.createElement('p');
          p.style.cssText = 'color:var(--muted);padding:16px 0;grid-column:1/-1';
          p.textContent = 'No items match the selected filters.';
          grid.appendChild(p);
        }
        return;
      }

      const frag = document.createDocumentFragment();
      for(const item of slice) frag.appendChild(card(item));
      grid.appendChild(frag);
      currentPage++;

      if(currentPage * PAGE_SIZE < currentList.length){
        grid.after(sentinel);
        ioObserver = new IntersectionObserver(entries => {
          if(entries[0].isIntersecting){
            ioObserver.disconnect();
            ioObserver = null;
            sentinel.remove();
            appendPage();
          }
        }, { rootMargin: '300px' });
        ioObserver.observe(sentinel);
      }
    }

    function render(){
      const sorter = SORTERS[state.sort] || SORTERS.recent;
      currentList = DB.filter(match).sort(sorter);
      currentPage = 0;

      countEl.textContent = `• ${currentList.length} items`;

      grid.replaceChildren();
      sentinel.remove();
      if(ioObserver){ ioObserver.disconnect(); ioObserver = null; }

      appendPage();
    }

    const onSearchInput = debounce(() => {
      state.q = qEl.value.trim().toLowerCase();
      render();
    }, 200);

    qEl.addEventListener("input", onSearchInput);
    vendorSel.addEventListener("change", () => {
      state.vendor = vendorSel.value;
      render();
    });
    sortTop.addEventListener("change", () => {
      state.sort = sortTop.value;
      render();
    });

    document.getElementById("clear").addEventListener("click", () => {
      state.q = "";
      state.category = "";
      state.vendor = "";
      state.subtags.clear();
      qEl.value = "";
      vendorSel.value = "";
      sortTop.value = state.sort;
      buildCategoryPills();
      buildSubtags();
      render();
    });

    async function init(){
      grid.innerHTML = '<p style="color:var(--muted);padding:16px 0;grid-column:1/-1;">Loading…</p>';
      let csvText;
      try {
        csvText = await loadCSVText();
      } catch {
        grid.innerHTML = '<p style="color:var(--muted);padding:16px 0;">Unable to load gear data. Please check your connection and refresh the page.</p>';
        countEl.textContent = '';
        return;
      }
      DB = parseCSV(csvText);

      const seen = new Set();
      DB = DB.filter(item => {
        if(seen.has(item.product)) return false;
        seen.add(item.product);
        return true;
      });

      if(DB.length === 0){
        grid.innerHTML = '<p style="color:var(--muted);padding:16px 0;">Unable to load gear data. Please check your connection and refresh the page.</p>';
        countEl.textContent = '';
        return;
      }
      buildVendorOptions();
      buildCategoryPills();
      buildSubtags();
      render();
    }

    init();