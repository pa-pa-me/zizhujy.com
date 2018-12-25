using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SQLite;
using System.Data;

namespace ZiZhuJY.Data
{
    public class SQLiteAdministrator
    {
        private string connectionString;
        public string ConnectionString { get { return connectionString; } set { connectionString = value; } }

        public DataTable Query(string cmdText, params SQLiteParameter[] parameters)
        {
            DataTable dt = new DataTable("tableQueryResult");
            using (SQLiteConnection cn = new SQLiteConnection(this.ConnectionString))
            {
                using (SQLiteCommand cmd = cn.CreateCommand())
                {
                    cmd.CommandText = cmdText;
                    foreach (SQLiteParameter parameter in parameters)
                    {
                        cmd.Parameters.AddWithValue(parameter.ParameterName, parameter.Value);
                    }

                    if (cn.State == System.Data.ConnectionState.Closed) cn.Open();
                    using (SQLiteDataReader dr = cmd.ExecuteReader(CommandBehavior.SingleRow))
                    {
                        dt.Load(dr);
                        dr.Close();
                    }
                }
                if (cn.State == ConnectionState.Open)
                    cn.Close();
            }
            return dt;
        }
    }
}
