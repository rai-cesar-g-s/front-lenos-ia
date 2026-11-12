import test from 'node:test';
import assert from 'node:assert/strict';
import { getYouTubeId } from '../src/utils/youtubeUrl.ts';

test('extracts only valid video IDs from supported YouTube URLs', () => {
  const id = 'abcdefghijk';
  for (const url of [`https://youtu.be/${id}`, `https://www.youtube.com/watch?feature=share&v=${id}`, `https://m.youtube.com/shorts/${id}`, `https://www.youtube.com/live/${id}`]) {
    assert.equal(getYouTubeId(url), id);
  }
  for (const url of [`https://youtube.com.example/watch?v=${id}`, `https://evil.example/?v=${id}`, `https://youtu.be@evil.example/${id}`, `https://user@youtu.be/${id}`, `javascript:https://youtu.be/${id}`, `https://youtu.be/${id}/more`, 'https://youtu.be/%3Cscript%3E']) {
    assert.equal(getYouTubeId(url), null);
  }
});
