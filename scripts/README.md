# Scripts

Utility scripts for AgroBot setup validation.

## Files

### check_setup.py
Validation script to check if everything is configured correctly.

**Usage:**
```bash
# From root directory
npm run check

# Or directly
python scripts/check_setup.py
```

**What it checks:**
- Backend files exist
- Frontend files exist
- Environment variables are set
- Python packages installed
- Node modules installed

## NPM Commands (Root Directory)

All setup and start commands are now available via npm from the root directory:

```bash
# Install all dependencies
npm run setup

# Start both servers
npm start

# Start backend only
npm run backend

# Start frontend only
npm run frontend

# Check configuration
npm run check

# Build for production
npm run build
```

## Notes

- Use `npm run setup` for first-time installation
- Use `npm start` to run both servers together
- Run `npm run check` if you encounter issues
