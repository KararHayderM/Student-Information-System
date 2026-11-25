
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');

const tableBody = document.getElementById('tableBody');
const tableHeader = document.getElementById('tableHeader');

let studentData = [];

if (userDisplay && currentUser) {
    userDisplay.textContent = currentUser;
}

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('sis_user');
        window.location.href = 'login.html';
        });
    }

    async function loadStudents() {
        try {
            const response = await fetch('/api/students');
            if (!response.ok) throw new Error('Failed to fetch students');

            studentData = await response.json();

            if (studentData.length === 0) {

            tableBody.replaceChildren(tableDisplayMessage("لا يوجد طلاب في قاعدة البيانات"))

            return;
        } 
        } catch (err) {
            console.error(err);
            tableBody.replaceChildren(tableDisplayMessage(" يوجد خطأ في الاتصال بقاعدة البيانات.",true))
            return
        }

        // Dynamic column headers from SQL keys
        const columns = Object.keys(studentData[0]);
        tableHeader.innerHTML = columns.map(col => `<th>${col}</th>`).join('');
        renderRows(studentData, columns);
    }

    // Render table rows
    function renderRows(data, columns) {
        if (data.length === 0) {
            tableBody.replaceChildren(tableDisplayMessage("لا يوجد طالب"))
            return;
        }

        tableBody.innerHTML = data.map(row => `
        <tr>
        ${columns.map(col => `
        <td style="text-align: right;">
        ${row[col] !== null && row[col] !== undefined ? row[col] : '-'}
        </td>
        `).join('')}
        </tr>
        `).join('');
        }

      // Real-time search filter
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (!studentData.length) return;

            const columns = Object.keys(studentData[0]);
            const filtered = studentData.filter(row => 
            columns.some(col => String(row[col] || '').toLowerCase().includes(query))
            );

            renderRows(filtered, columns);
        });
    }

    loadStudents();

    function tableDisplayMessage(msg,iserr = false) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        
        tr.className = iserr ? 'table-status-row is-error' : 'table-status-row';
        td.colSpan = 10;
        td.setAttribute('data-message', msg);
        
        tr.appendChild(td);
        return tr;

    }
