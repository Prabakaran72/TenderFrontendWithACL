const useBaseUrl = () => {
  return {
    // server1 : "/backend",
    server1: "http://192.168.1.29:8000",
    server2: "http://192.168.1.32:8000",    
    // server1: "http://192.168.1.29:8000",
    // server1: "http://192.168.1.62:8081",
    // server1: "http://localhost:8000",
  };
};

export { useBaseUrl };
