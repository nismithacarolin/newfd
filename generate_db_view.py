import mysql.connector
import os
from db_config import MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_DB

OUTPUT_FILE = "database_view.html"

def generate_html():
    try:
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DB
        )
        cur = conn.cursor()
    except Exception as e:
        print(f"Error connecting to MySQL: {e}")
        return

    # Get tables
    cur.execute("SHOW TABLES;")
    tables = cur.fetchall()

    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live MySQL Database View</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background-color: #f0f2f5; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .container { max-width: 1200px; }
            .table-container { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 40px; border: 1px solid #e1e4e8; }
            h1 { color: #1a73e8; text-align: center; margin-bottom: 50px; font-weight: 700; }
            h2 { color: #202124; border-left: 5px solid #1a73e8; padding-left: 15px; margin-bottom: 25px; font-size: 1.5rem; }
            h5 { color: #5f6368; margin-top: 20px; margin-bottom: 15px; font-weight: 600; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; }
            .table-responsive { border-radius: 8px; overflow: hidden; }
            .table { margin-bottom: 0; }
            .table-light th { background-color: #f8f9fa; color: #3c4043; border-bottom: 2px solid #dee2e6; }
            .badge-pk { background-color: #e8f0fe; color: #1a73e8; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Live Backend Database View (MySQL)</h1>
    """

    for table_name in tables:
        table = table_name[0]
        html_content += f'<div class="table-container" id="{table}"><h2>Table: <span class="text-primary">{table}</span></h2>'

        # Get Schema
        cur.execute(f"DESCRIBE {table}")
        columns = cur.fetchall()
        
        html_content += "<h5>Schema Structure:</h5><div class='table-responsive mb-4'><table class='table table-bordered table-sm'><thead class='table-light'><tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr></thead><tbody>"
        
        col_names = []
        for col in columns:
            name = col[0]
            dtype = col[1]
            null = col[2]
            key = col[3]
            default = col[4]
            pk_badge = f'<span class="badge-pk">PRIMARY</span>' if key == 'PRI' else ""
            col_names.append(name)
            html_content += f"<tr><td><strong>{name}</strong></td><td>{dtype}</td><td>{null}</td><td>{pk_badge}</td><td>{default}</td></tr>"
        
        html_content += "</tbody></table></div>"

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
                # Handle None values and truncation for long text
                display_val = str(cell) if cell is not None else '<span class="text-muted">NULL</span>'
                if len(display_val) > 100:
                    display_val = display_val[:97] + "..."
                html_content += f"<td>{display_val}</td>"
            html_content += "</tr>"
        
        if not rows:
            html_content += f"<tr><td colspan='{len(col_names)}' class='text-center text-muted'>No data found in this table.</td></tr>"
        
        html_content += "</tbody></table></div></div>"

    html_content += """
        <div class="text-center text-muted mt-5 pb-5">
            <p>Automatically generated from <strong>college_cms</strong> MySQL Database</p>
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
