-- Diagnostic queries to find all role/profile insertion mechanisms in the database

-- Find all triggers that might handle user/role/profile creation
SELECT event_object_schema, event_object_table, trigger_name, event_manipulation, 
       action_statement, action_timing
FROM information_schema.triggers
WHERE (event_object_table LIKE '%profile%' OR 
       event_object_table LIKE '%user%' OR
       event_object_table LIKE '%role%' OR
       action_statement LIKE '%insert%profile%' OR
       action_statement LIKE '%insert%role%' OR
       action_statement LIKE '%create%user%')
ORDER BY event_object_schema, event_object_table, trigger_name;

-- Find all functions that might handle inserting profiles or roles
SELECT routine_schema, routine_name, routine_type, 
       r.data_type AS return_type, 
       parameter_name, parameter_mode, udt_name AS parameter_type,
       substring(routine_definition, 1, 200) AS function_preview
FROM information_schema.routines r
LEFT JOIN information_schema.parameters p 
  ON r.specific_name = p.specific_name AND r.specific_schema = p.specific_schema
WHERE (routine_name LIKE '%profile%' OR 
       routine_name LIKE '%user%' OR 
       routine_name LIKE '%role%' OR
       routine_name LIKE '%insert%' OR
       routine_definition LIKE '%INSERT INTO%profile%' OR
       routine_definition LIKE '%INSERT INTO%role%' OR
       routine_definition LIKE '%create_user%') AND
       routine_schema != 'pg_catalog' AND
       routine_schema != 'information_schema'
ORDER BY routine_schema, routine_name, parameter_name;

-- Look specifically for auth hooks
SELECT t.tgname AS trigger_name, 
       n.nspname AS schema_name,
       c.relname AS table_name,
       CASE t.tgenabled WHEN 'D' THEN 'disabled'
                        WHEN 'O' THEN 'enabled'
                        WHEN 'R' THEN 'replica'
                        WHEN 'A' THEN 'always' END AS status,
       pg_get_functiondef(t.tgfoid) AS trigger_function
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' OR c.relname LIKE '%user%' OR c.relname LIKE '%profile%'
ORDER BY n.nspname, c.relname, t.tgname;

-- Look for auth.users related triggers
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users'
ORDER BY trigger_name;

-- Check for Supabase auth triggers (auth.on_auth_user_created)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'on_auth_user_created') THEN
    RAISE NOTICE 'Found on_auth_user_created function:';
    -- Intentionally not executing the full function code retrieval to avoid errors
  END IF;
END $$;

-- Find anything in pg_proc related to user/role/profile creation
SELECT n.nspname AS schema_name,
       p.proname AS function_name,
       pg_get_function_arguments(p.oid) AS arguments,
       CASE p.prokind WHEN 'f' THEN 'function'
                      WHEN 'p' THEN 'procedure' 
                      WHEN 'a' THEN 'aggregate'
                      WHEN 'w' THEN 'window' END AS kind,
       l.lanname AS language
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
JOIN pg_language l ON p.prolang = l.oid
WHERE p.proname LIKE '%user%' OR 
      p.proname LIKE '%profile%' OR 
      p.proname LIKE '%role%' OR
      p.proname LIKE '%auth%'
ORDER BY n.nspname, p.proname; 