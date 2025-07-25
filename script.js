// Initialization
let oldBdt = 0;
let advanceBdt = 0;
let currentRate = 1; // SAR is replaced by BDT, so rate is 1
let businessName = "ZUNAID'S DINE";

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    loadHistory();

    // Old BDT Modal listeners
    const oldBdtModal = document.getElementById('oldBdtModal');
    const oldBdtCloseBtn = oldBdtModal.querySelector('.close-button');
    const saveOldBdtBtn = document.getElementById('saveOldBdtBtn');

    oldBdtCloseBtn.onclick = hideOldBdtModal;
    saveOldBdtBtn.onclick = saveOldBdtFromModal;

    // Advance BDT Modal listeners
    const advanceBdtModal = document.getElementById('advanceBdtModal');
    const advanceBdtCloseBtn = advanceBdtModal.querySelector('.close-button');
    const saveAdvanceBdtBtn = document.getElementById('saveAdvanceBdtBtn');

    advanceBdtCloseBtn.onclick = hideAdvanceBdtModal;
    saveAdvanceBdtBtn.onclick = saveAdvanceBdtFromModal;

    // Settings Modal listeners
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = settingsModal.querySelector('.close-button');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    settingsCloseBtn.onclick = hideSettingsModal;
    saveSettingsBtn.onclick = saveSettingsFromModal;

    window.onclick = function(event) {
        if (event.target == oldBdtModal) {
            hideOldBdtModal();
        }
        if (event.target == advanceBdtModal) {
            hideAdvanceBdtModal();
        }
        if (event.target == settingsModal) {
            hideSettingsModal();
        }
    }
});

function onEntryChange() {
    calculateTotal();
    saveState();
}

function showOldBdtModal() {
    const modal = document.getElementById('oldBdtModal');
    const oldBdtInput = document.getElementById('oldBdtInput');
    oldBdtInput.value = oldBdt > 0 ? oldBdt.toFixed(2) : '';
    modal.style.display = 'block';
    oldBdtInput.focus();
}

function hideOldBdtModal() {
    const modal = document.getElementById('oldBdtModal');
    modal.style.display = 'none';
}

function saveOldBdtFromModal() {
    const oldBdtInput = document.getElementById('oldBdtInput');
    const newOldBdt = parseFloat(oldBdtInput.value) || 0;
    
    oldBdt = newOldBdt;
    onEntryChange();
    hideOldBdtModal();
}

function showAdvanceBdtModal() {
    const modal = document.getElementById('advanceBdtModal');
    const advanceBdtInput = document.getElementById('advanceBdtInput');
    advanceBdtInput.value = advanceBdt > 0 ? advanceBdt.toFixed(2) : '';
    modal.style.display = 'block';
    advanceBdtInput.focus();
}

function hideAdvanceBdtModal() {
    const modal = document.getElementById('advanceBdtModal');
    modal.style.display = 'none';
}

function saveAdvanceBdtFromModal() {
    const advanceBdtInput = document.getElementById('advanceBdtInput');
    const newAdvanceBdt = parseFloat(advanceBdtInput.value) || 0;
    
    advanceBdt = newAdvanceBdt;
    onEntryChange();
    hideAdvanceBdtModal();
}

function showSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const businessNameInput = document.getElementById('businessNameInput');
    businessNameInput.value = businessName;
    modal.style.display = 'block';
    businessNameInput.focus();
}

function hideSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'none';
}

function saveSettingsFromModal() {
    const businessNameInput = document.getElementById('businessNameInput');
    const newName = businessNameInput.value.trim();
    if (newName) {
        businessName = newName;
    } else {
        businessName = "ZUNAID'S DINE"; // Reset to default if empty
    }
    saveState();
    hideSettingsModal();
}

function addEntry(phone = '', amount = '', bkash = false, nagad = false) {
    const entries = document.getElementById('entries');
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `
      <input type="text" class="phone" placeholder="Phone" value="${phone}" oninput="onEntryChange()">
      <input type="number" class="amount" placeholder="Amount" value="${amount}" oninput="onEntryChange()">
      <div class="checkboxes">
        <label><input type="checkbox" class="bkash" ${bkash ? 'checked' : ''} onchange="onEntryChange()">Bkash</label>
        <label><input type="checkbox" class="nagad" ${nagad ? 'checked' : ''} onchange="onEntryChange()">Nagad</label>
      </div>
      <button class="delete-entry-btn" onclick="removeEntry(this)">
        <img src="delete-icon.png" alt="Delete"/>
      </button>
    `;
    entries.appendChild(div);
    onEntryChange();
}

function removeEntry(button) {
    button.closest('.entry').remove();
    onEntryChange();
}

function getEntriesData() {
    const entriesData = [];
    document.querySelectorAll('.entry').forEach(entryEl => {
        const phone = entryEl.querySelector('.phone').value;
        const amount = entryEl.querySelector('.amount').value;
        const bkash = entryEl.querySelector('.bkash').checked;
        const nagad = entryEl.querySelector('.nagad').checked;
        if (phone || amount) {
            entriesData.push({ phone, amount, bkash, nagad });
        }
    });
    return entriesData;
}

function calculateTotal() {
    let total = 0;
    const entriesData = getEntriesData();
    entriesData.forEach(entry => {
        total += parseFloat(entry.amount) || 0;
    });

    document.getElementById('totalBDT').innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/1170/1170627.png" /> Total TK: ${total.toFixed(2)}`;
    const rate = currentRate;
    const subtotalBdt = rate > 0 ? (total / rate) : 0;
    document.getElementById('totalBDTSub').innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/9377/9377574.png" /> Subtotal BDT: ${subtotalBdt.toFixed(2)}`;

    const oldBdtDisplay = document.getElementById('oldBdtDisplay');
    const advanceBdtDisplay = document.getElementById('advanceBdtDisplay');
    const grandTotalBdtDisplay = document.getElementById('grandTotalBdtDisplay');
    
    let grandTotalBdt = subtotalBdt;

    if (oldBdt > 0) {
        document.getElementById('oldBdtValueText').innerText = oldBdt.toFixed(2);
        oldBdtDisplay.style.display = 'block';
        grandTotalBdt += oldBdt;
    } else {
        oldBdtDisplay.style.display = 'none';
    }

    if (advanceBdt > 0) {
        document.getElementById('advanceBdtValueText').innerText = advanceBdt.toFixed(2);
        advanceBdtDisplay.style.display = 'block';
        grandTotalBdt -= advanceBdt;
    } else {
        advanceBdtDisplay.style.display = 'none';
    }
    
    if (oldBdt > 0 || advanceBdt > 0) {
        const grandTotalBdtLabel = document.getElementById('grandTotalBdtLabel');
        const grandTotalBdtValue = document.getElementById('grandTotalBdtValue');

        if (grandTotalBdt < 0) {
            grandTotalBdtLabel.innerText = 'Joma:';
            grandTotalBdtValue.innerText = Math.abs(grandTotalBdt).toFixed(2);
        } else {
            grandTotalBdtLabel.innerText = 'Due BDT:';
            grandTotalBdtValue.innerText = grandTotalBdt.toFixed(2);
        }
        
        grandTotalBdtDisplay.style.display = 'flex';
    } else {
        grandTotalBdtDisplay.style.display = 'none';
    }
}

function saveState() {
    const state = {
        entries: getEntriesData(),
        rate: currentRate,
        oldBdt: oldBdt,
        advanceBdt: advanceBdt,
        businessName: businessName
    };
    localStorage.setItem('zunaidInvoiceState', JSON.stringify(state));
}

function loadState() {
    const state = JSON.parse(localStorage.getItem('zunaidInvoiceState'));
    const entriesContainer = document.getElementById('entries');
    entriesContainer.innerHTML = '';

    if (state) {
        currentRate = state.rate || 1;
        oldBdt = state.oldBdt || 0;
        advanceBdt = state.advanceBdt || 0;
        businessName = state.businessName || "ZUNAID'S DINE";
    } else {
        // Legacy support for old state keys
        const oldState = JSON.parse(localStorage.getItem('zunaidInvoiceState'));
        if (oldState) {
            oldBdt = oldState.oldSar || 0;
            advanceBdt = oldState.advanceSar || 0;
        }
    }

    if (state && state.entries && state.entries.length > 0) {
        state.entries.forEach(entry => {
            addEntry(entry.phone, entry.amount, entry.bkash, entry.nagad);
        });
    } else {
        addEntry(); // Start with one empty entry
    }
    calculateTotal();
}

function generateInvoiceHTML(invoiceData) {
    const { entries, rate, date, time, total, subtotal, oldBdtValue, advanceBdtValue } = invoiceData;
    let html = `
      <div style='text-align:center; font-weight:bold;'>${businessName}</div>
      <div style='text-align:center;'>Date: ${date} Time: ${time}</div>
      <hr>
      <div style='text-align:center; font-weight:bold; font-size:16px;'>INVOICE</div>
      <table style='width:100%; font-size:14px; border-collapse: collapse;' border='1'>
        <tr><th>No.</th><th>Phone</th><th>TK</th><th>Bkash</th><th>Nagad</th></tr>`;

    entries.forEach((entry, i) => {
      html += `<tr><td>${i + 1}</td><td>${entry.phone}</td><td>${entry.amount}</td><td style="text-align:center;">${entry.bkash ? '✔️' : ''}</td><td style="text-align:center;">${entry.nagad ? '✔️' : ''}</td></tr>`;
    });
    
    html += `</table>
      <div style='text-align:right;'>Total TK: ${total.toFixed(2)}</div>
      <div style='text-align:right;'>Subtotal BDT: ${subtotal}</div>`;
      
    let grandTotalBdt = parseFloat(subtotal);
      
    if (oldBdtValue && oldBdtValue > 0) {
        html += `<div style='text-align:right; font-size:12px;'>Old BDT Balance: +${oldBdtValue.toFixed(2)}</div>`;
        grandTotalBdt += oldBdtValue;
    }

    if (advanceBdtValue && advanceBdtValue > 0) {
        html += `<div style='text-align:right; font-size:12px;'>Joma BDT: -${advanceBdtValue.toFixed(2)}</div>`;
        grandTotalBdt -= advanceBdtValue;
    }
      
    if ((oldBdtValue && oldBdtValue > 0) || (advanceBdtValue && advanceBdtValue > 0)) {
        html += `<hr style="border: 0; border-top: 1px dashed #8c8b8b; background: #fff; margin: 5px 0;">`;
        if (grandTotalBdt < 0) {
            html += `<div style='text-align:right; font-weight:bold; font-size:12px; color:green;'>Joma: ${Math.abs(grandTotalBdt).toFixed(2)}</div>`;
        } else {
            html += `<div style='text-align:right; font-weight:bold; font-size:12px; color:red;'>Due BDT: ${grandTotalBdt.toFixed(2)}</div>`;
        }
    }
      
    html += `
      <hr>
      <div style='text-align:center;'>*** Thank You, Visit Again! ***</div>
      <div style='text-align:center;'>This is a computer generated receipt.</div>
      <div style='text-align:center; margin-top:15px; font-size:10px; font-style:italic; color:#b0b0b0; text-shadow: 1px 1px 1px #fff;'>creator by zunaid</div>`;
    
    return html;
}

function generateInvoice() {
    const entries = getEntriesData();
    if (entries.length === 0) {
        alert("Please add at least one entry.");
        return;
    }

    const now = new Date();
    const dateInput = document.getElementById('invoiceDate');
    const userDateValue = dateInput.value; // YYYY-MM-DD

    let displayDate;
    if (userDateValue) {
        const [year, month, day] = userDateValue.split('-');
        displayDate = `${day}/${month}/${year}`;
    } else {
        displayDate = now.toLocaleDateString('en-GB');
    }

    const invoiceData = {
        id: Date.now(),
        entries: entries,
        rate: currentRate,
        date: displayDate,
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        total: 0,
        subtotal: 0,
        oldBdtValue: oldBdt,
        advanceBdtValue: advanceBdt,
        manualDate: userDateValue || null
    };

    invoiceData.entries.forEach(entry => {
        invoiceData.total += parseFloat(entry.amount) || 0;
    });
    invoiceData.subtotal = (invoiceData.total / invoiceData.rate).toFixed(2);
    
    const receipt = document.getElementById('receipt');
    receipt.innerHTML = generateInvoiceHTML(invoiceData);

    html2canvas(receipt).then(canvas => {
      const link = document.createElement('a');
      link.download = `invoice-${invoiceData.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });

    saveInvoiceToHistory(invoiceData);
}

function saveInvoiceToHistory(invoiceData) {
    const history = JSON.parse(localStorage.getItem('zunaidInvoiceHistory')) || [];
    history.unshift(invoiceData); // Add to the beginning
    if (history.length > 50) { // Keep history manageable
        history.pop();
    }
    localStorage.setItem('zunaidInvoiceHistory', JSON.stringify(history));
    renderHistory();
}

function loadHistory() {
    renderHistory();
}

function renderHistory() {
    const historyDiv = document.getElementById('history');
    const history = JSON.parse(localStorage.getItem('zunaidInvoiceHistory')) || [];
    historyDiv.innerHTML = '';

    if (history.length === 0) {
        historyDiv.innerHTML = '<p style="text-align:center;">No history yet.</p>';
        return;
    }

    history.forEach(invoiceData => {
        const container = document.createElement('div');
        container.className = 'history-item';
        
        let subtotal = invoiceData.subtotal;
        // Backwards compatibility for old history items
        if (invoiceData.sar) {
            subtotal = invoiceData.sar;
        }

        let detailsHTML = `Total: ${invoiceData.total.toFixed(2)} TK / ${subtotal} BDT (${invoiceData.entries.length} entries)`;
        
        const oldBdtValue = invoiceData.oldBdtValue || invoiceData.oldSarValue;
        if (oldBdtValue && oldBdtValue > 0) {
            detailsHTML += `<br>Old BDT Balance: +${oldBdtValue.toFixed(2)}`;
        }
        
        const advanceBdtValue = invoiceData.advanceBdtValue || invoiceData.advanceSarValue;
        if (advanceBdtValue && advanceBdtValue > 0) {
            detailsHTML += `<br>Joma BDT: -${advanceBdtValue.toFixed(2)}`;
        }
        
        container.innerHTML = `
            <div class="history-item-header">Invoice - ${invoiceData.date} ${invoiceData.time}</div>
            <div class="history-item-details">
                ${detailsHTML}
            </div>
            <div class="history-item-actions">
                <button class="history-btn download-btn" onclick="downloadHistoryItem('${invoiceData.id}')">Download</button>
                <button class="history-btn edit-btn" onclick="editHistoryItem('${invoiceData.id}')">Edit</button>
                <button class="history-btn delete-history-btn" onclick="deleteHistoryItem('${invoiceData.id}')">Delete</button>
            </div>
        `;
        historyDiv.appendChild(container);
    });
}

function findHistoryItem(id) {
    const history = JSON.parse(localStorage.getItem('zunaidInvoiceHistory')) || [];
    return history.find(item => item.id.toString() === id.toString());
}

function downloadHistoryItem(id) {
    const invoiceData = findHistoryItem(id);
    if (!invoiceData) return;

    const receipt = document.getElementById('receipt');
    receipt.innerHTML = generateInvoiceHTML(invoiceData);
    
    html2canvas(receipt).then(canvas => {
      const link = document.createElement('a');
      link.download = `invoice-${invoiceData.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
}

function editHistoryItem(id) {
    const invoiceData = findHistoryItem(id);
    if (!invoiceData) return;
    
    // Restore oldBdt and advanceBdt from the history item
    oldBdt = (invoiceData.oldBdtValue || invoiceData.oldSarValue) || 0;
    advanceBdt = (invoiceData.advanceBdtValue || invoiceData.advanceSarValue) || 0;
    currentRate = invoiceData.rate || (invoiceData.sarRate ? 32.5 : 1); // Fallback for old data
    
    // Restore manual date
    const dateInput = document.getElementById('invoiceDate');
    dateInput.value = invoiceData.manualDate || '';
    
    const entriesContainer = document.getElementById('entries');
    entriesContainer.innerHTML = '';
    
    if (invoiceData.entries && invoiceData.entries.length > 0) {
        invoiceData.entries.forEach(entry => {
            addEntry(entry.phone, entry.amount, entry.bkash, entry.nagad);
        });
    } else {
        addEntry(); // Add a blank entry to reset the view and trigger calculations
    }

    calculateTotal(); // Recalculate with restored values
    toggleHistory(false); // Close history panel
    window.scrollTo(0,0); // Scroll to top
}

function deleteHistoryItem(id) {
    let history = JSON.parse(localStorage.getItem('zunaidInvoiceHistory')) || [];
    history = history.filter(item => item.id.toString() !== id.toString());
    localStorage.setItem('zunaidInvoiceHistory', JSON.stringify(history));
    renderHistory();
}

function toggleHistory(forceState) {
    const history = document.getElementById('history');
    const isVisible = history.style.display === 'block';

    if (typeof forceState === 'boolean') {
        history.style.display = forceState ? 'block' : 'none';
    } else {
        history.style.display = isVisible ? 'none' : 'block';
    }

    if(history.style.display === 'block') {
        renderHistory();
    }
}