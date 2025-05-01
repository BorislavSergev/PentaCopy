-- Migration to add metadata column to chat_messages table
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS metadata JSONB;
COMMENT ON COLUMN chat_messages.metadata IS 'Additional metadata for the message such as chunking info'; 