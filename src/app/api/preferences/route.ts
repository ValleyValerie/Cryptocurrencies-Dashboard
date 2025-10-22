// src/app/api/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';

// Mock preferences storage (replace with database)
const userPreferences = new Map();

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const preferences = userPreferences.get(user.id) || user.preferences;

    return NextResponse.json({ preferences }, { status: 200 });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { theme, chartType, refreshInterval } = body;

    const updatedPreferences = {
      theme: theme || user.preferences.theme,
      chartType: chartType || user.preferences.chartType,
      refreshInterval: refreshInterval || user.preferences.refreshInterval,
    };

    userPreferences.set(user.id, updatedPreferences);

    return NextResponse.json(
      { message: 'Preferences updated', preferences: updatedPreferences },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}