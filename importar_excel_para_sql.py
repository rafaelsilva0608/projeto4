import pandas as pd
from sqlalchemy import create_engine

arquivo_excel = "Banco_Eventos_Igreja.xlsx"

eventos = pd.read_excel(arquivo_excel, sheet_name="Eventos")
pessoas = pd.read_excel(arquivo_excel, sheet_name="Pessoas")
inscricoes = pd.read_excel(arquivo_excel, sheet_name="Inscricoes")

engine = create_engine("sqlite:///igreja.db") 

eventos.to_sql("eventos", con=engine, index=False, if_exists="replace")
pessoas.to_sql("pessoas", con=engine, index=False, if_exists="replace")
inscricoes.to_sql("inscricoes", con=engine, index=False, if_exists="replace")

print("Banco criado com sucesso: igreja.db")

import sqlite3
import pandas as pd

conexao = sqlite3.connect('igreja.db') 

tabelas = pd.read_sql_query("SELECT name FROM sqlite_master WHERE type='table';", conexao)
print("Tabelas encontradas:", tabelas)

for nome_tabela in tabelas['name']:
    df = pd.read_sql_query(f"SELECT * FROM {nome_tabela};", conexao)
    df.to_csv(f"{nome_tabela}.csv", index=False)
    print(f"Tabela '{nome_tabela}' exportada para {nome_tabela}.csv")

conexao.close()
