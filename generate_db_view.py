import sqlite3
import os

DB_PATH = "instance/college_cms_v2.db"
OUTPUT_FILE = "database_view.html"

def generate_html():
    if not os.path.exists(DB_PATH):
        print("Dataset not found!")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Get tables
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name != 'sqlite_sequence';")
    tables = cur.fetchall()

    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Database Documentation View</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background-color: #f8f9fa; padding: 20px; }
            .table-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 30px; }
            h1 { color: #2c3e50; text-align: center; margin-bottom: 40px; }
            h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px; }
            .badge { font-size: 0.9em; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Backend Database Schema (SQLite)</h1>
    """

    for table_name in tables:
        table = table_name[0]
        html_content += f'<div class="table-container"><h2>Table: <span class="text-primary">{table}</span></h2>'

        # Get Schema
        cur.execute(f"PRAGMA table_info({table})")
        columns = cur.fetchall()
        
        html_content += "<h5>Schema Structure:</h5><table class='table table-bordered table-sm mb-4'><thead class='table-light'><tr><th>Column Name</th><th>Data Type</th><th>Primary Key</th></tr></thead><tbody>"
        
        col_names = []
        for col in columns:
            col_id = col[0]
            name = col[1]
            dtype = col[2]
            pk = "YES" if col[5] else ""
            col_names.append(name)
            html_content += f"<tr><td>{name}</td><td>{dtype}</td><td>{pk}</td></tr>"
        
        html_content += "</tbody></table>"

        # Get Data
        html_content += "<h5>Table Data:</h5><div class='table-responsive'><table class='table table-striped table-hover'><thead><tr>"
        for name in col_names:
            html_content += f"<th>{name}</th>"
        html_content += "</tr></thead><tbody>"

        cur.execute(f"SELECT * FROM {table}")
        rows = cur.fetchall()
        for row in rows:
            html_content += "<tr>"
            for cell in row:
                html_content += f"<td>{cell}</td>"
            html_content += "</tr>"
        
        html_content += "</tbody></table></div></div>"

    html_content += """
        <div class="text-center text-muted mt-5">
            <p>Generated for Project Documentation</p>
        </div>
        </div>
    </body>
    </html>
    """
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"Successfully generated {OUTPUT_FILE}")
    conn.close()

if __name__ == "__main__":
    generate_html()
