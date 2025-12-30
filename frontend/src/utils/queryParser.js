// Query parser for mock SIEM terminal
export const parseQuery = (query, logs) => {
  if (!query.trim()) {
    return { success: false, message: 'No query provided' };
  }

  const lowerQuery = query.toLowerCase().trim();
  
  // Handle 'search' command
  if (lowerQuery.startsWith('search ')) {
    const searchTerm = lowerQuery.replace('search ', '');
    const filtered = logs.filter(log => {
      const logString = Object.values(log).join(' ').toLowerCase();
      return logString.includes(searchTerm);
    });
    
    return {
      success: true,
      message: `Found ${filtered.length} matching log entries`,
      results: filtered
    };
  }
  
  // Handle 'filter' command with key=value syntax
  if (lowerQuery.startsWith('filter ')) {
    const filterPart = lowerQuery.replace('filter ', '');
    const [key, value] = filterPart.split('=').map(s => s.trim());
    
    if (!key || !value) {
      return { success: false, message: 'Invalid filter syntax. Use: filter key=value' };
    }
    
    const filtered = logs.filter(log => {
      const logValue = log[key] || log[key.toLowerCase()] || '';
      return logValue.toLowerCase().includes(value.toLowerCase());
    });
    
    return {
      success: true,
      message: `Filtered by ${key}=${value}: ${filtered.length} results`,
      results: filtered
    };
  }
  
  // Handle 'stats' command
  if (lowerQuery.startsWith('stats ')) {
    const statsPart = lowerQuery.replace('stats ', '');
    
    if (statsPart.includes('count by ')) {
      const field = statsPart.replace('count by ', '').trim();
      const stats = {};
      
      logs.forEach(log => {
        const value = log[field] || log[field.toLowerCase()] || 'unknown';
        stats[value] = (stats[value] || 0) + 1;
      });
      
      const output = Object.entries(stats)
        .map(([key, count]) => `${key}: ${count}`)
        .join('\n');
      
      return {
        success: true,
        message: output,
        results: null
      };
    }
  }
  
  // Handle 'timeline' command
  if (lowerQuery.startsWith('timeline ')) {
    const host = lowerQuery.replace('timeline ', '').replace('host=', '').trim();
    
    const hostLogs = logs.filter(log => 
      log.host.toLowerCase() === host.toLowerCase()
    );
    
    return {
      success: true,
      message: `Timeline for ${host.toUpperCase()}: ${hostLogs.length} events`,
      results: hostLogs,
      timelineMode: true,
      host: host.toUpperCase()
    };
  }
  
  // Unknown command
  return {
    success: false,
    message: `Unknown command. Try: search, filter, stats count by, timeline`
  };
};
