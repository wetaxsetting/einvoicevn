"use strict"

class DBService {
    constructor() {
        this.Env = use('Env')
        this.DB_CONNECTION = this.Env.get("DB_CONNECTION")
        this.DB_CONNECTION2 = this.Env.get("DB_CONNECTION2", "")
        if (this.DB_CONNECTION == "mysql") {
            this.myDB = use('MySQLService')
        } else if (this.DB_CONNECTION == "oracle") {
            this.myDB = use('OracleService')
        } else {
            console.log(`Not support this DB[${this.DB_CONNECTION}] yet`)
        }
        if (this.DB_CONNECTION2 == "mysql2") {
            this.myDB2 = use('MySQLService')
        }
    }
    async clearCache() {
        return this.myDB.clearCache()
    }
    async callBulkProcCursor(p_proc, p_para = null, p_language, p_crt_by, p_dbinfo) {

        return this.myDB.callBulkProcCursor(p_proc, p_para, p_language, p_crt_by, p_dbinfo);
    }
    async callProcCursor(p_proc, p_para = null, p_language, p_crt_by, p_db2 = null) {
        if (p_db2 == "Y") {
            if (this.DB_CONNECTION2 == "mysql2") {
                //console.log("this.myDB2", this.myDB2)
                return this.myDB2.callProcCursor(p_proc, p_para, p_language, p_crt_by)
            }
            return this.myDB.callProcCursor2(p_proc, p_para, p_language, p_crt_by)
        }
        return this.myDB.callProcCursor(p_proc, p_para, p_language, p_crt_by)
    }
    async callProcMultiCursor(p_proc, p_para = null, p_language, p_crt_by, p_number_cursor, p_db2 = null) {
        if (p_db2 == "Y") {
            if (this.DB_CONNECTION2 == "mysql2") {
                return this.myDB2.callProcMultiCursor(p_proc, p_para, p_language, p_crt_by, p_number_cursor)
            }
            return this.myDB.callProcMultiCursor2(p_proc, p_para, p_language, p_crt_by, p_number_cursor)
        }
        return this.myDB.callProcMultiCursor(p_proc, p_para, p_language, p_crt_by, p_number_cursor)
    }
    async ExecuteSQLBlob(p_statement, p_bind = {}, p_language, p_crt_by, p_db2 = null) {
        if (p_db2 == "Y") {
            if (this.DB_CONNECTION2 == "mysql2") {
                return this.myDB2.ExecuteSQLBlob(p_statement, p_bind, p_language, p_crt_by)
            }
            return this.myDB.ExecuteSQLBlob2(p_statement, p_bind, p_language, p_crt_by)
        }
        return this.myDB.ExecuteSQLBlob(p_statement, p_bind, p_language, p_crt_by)
    }
    async ExecuteSQL(p_sql, p_para, p_crt_by, p_db2 = null) {
        if (p_db2 == "Y") {
            if (this.DB_CONNECTION2 == "mysql2") {
                return this.myDB2.ExecuteSQL(p_sql, p_para, p_crt_by)
            }
            return this.myDB.ExecuteSQL2(p_sql, p_para, p_crt_by)
        }
        return this.myDB.ExecuteSQL(p_sql, p_para, p_crt_by)
    }
}
module.exports = DBService