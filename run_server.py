"""
Server entrypoint for the Adaptive AI Travel Decision Engine.
Runs FastAPI server with auto-configured python paths.
"""

import sys
import os
import uvicorn

backend_dir = os.path.join(os.path.dirname(__file__), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print(" 🚀 GlobeTrotter Adaptive AI Travel Decision Engine")
    print(" 🌐 Server running at: http://localhost:8000")
    print(" 📚 API Documentation: http://localhost:8000/docs")
    print("=" * 60 + "\n")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True, app_dir=backend_dir)
