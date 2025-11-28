-- Migration: Add deleted column to conversations table
-- Run this SQL in your Supabase SQL Editor to add soft delete support

-- Add deleted column to conversations table
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for filtering deleted conversations
CREATE INDEX IF NOT EXISTS idx_conversations_deleted ON conversations(deleted);

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON conversations;

-- Recreate SELECT policy to exclude deleted conversations
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id AND deleted = FALSE);

-- Create UPDATE policy (using ALL to avoid conflicts, then checking ownership)
CREATE POLICY "Users can update their own conversations"
  ON conversations FOR ALL
  USING (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON COLUMN conversations.deleted IS 'Soft delete flag - when TRUE, conversation is hidden from lists';
