# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies
```bash
cd /home/tim-mayoh/code/ui-test
npm install
```

### 2. Start Development
```bash
# Option A: Using the helper script
./dev.sh

# Option B: Direct command
npm run dev
```

### 3. Open Browser
Visit: **http://localhost:3000**

---

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `./dev.sh` | Interactive menu for all tasks |

---

## 🎯 Key Features to Try

### 1. **Navigate Between Shells** (Left Sidebar)
- Home - Current pressures dashboard
- Programme - Timetable and gateways
- Policies - Policy drafting
- Places - Sites management
- Evidence - Evidence library with search
- Engage - Consultations
- Decisions - Options analysis
- Monitoring - Signals dashboard

### 2. **Switch Planning Stages** (Top Ribbon)
Click any stage to navigate (Scoping → G1 → Content → G2 → Draft → G3 → Submission → Exam → Adoption → Monitoring)

### 3. **Change Reading Profile** (Top Right)
- Click the reading button to see interpretation frameworks
- Switch between "Balanced" and "Delivery-leaning"
- View emphasis, cues, and source basis

### 4. **Explore Current Pressures** (Home Shell)
- Click a pressure card to expand details
- See "Why now" and "Impacts"
- Click "Explore scenarios" to go to Scenarios shell

### 5. **Search Evidence** (Evidence Shell)
- Use search box to filter by title, tags, or usage
- View evidence status and links

---

## 🏗️ Project Architecture

```
TPA Interactive Shells
├── 8 Main Shells (navigation areas)
├── 10 Planning Stages (workflow progression)
├── 2 Reading Profiles (policy interpretations)
├── Multiple data types (pressures, evidence, consultations, etc.)
└── Responsive design (desktop + mobile)
```

---

## 🛠️ Development Tips

### File Watcher Limit Issue
If you see "ENOSPC: System limit for number of file watchers reached":

```bash
# Temporary fix (current session)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Or just use production build
npm run build
npm start
```

### Hot Reload
The dev server supports hot module replacement - changes appear instantly without refresh.

### Component Development
1. Components in `components/` folder
2. UI primitives in `components/ui/`
3. Shell-specific in `components/shells/`
4. Import with `@/` alias (e.g., `@/components/ui/button`)

### State Management
All app state is in `hooks/use-app-data.ts` - modify this file to add new data or functionality.

### Styling
- Tailwind CSS utility classes
- Custom colors in `lib/constants.ts` (BRAND object)
- Global styles in `app/globals.css`
- Custom variants in Tailwind config

---

## 📱 Mobile View

The app is fully responsive:
- **Desktop**: Sidebar always visible
- **Mobile**: Hamburger menu opens sheet drawer
- Stage ribbon scrolls horizontally
- Cards stack vertically
- Touch-friendly buttons and spacing

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### TypeScript Errors
```bash
# Check types without building
npx tsc --noEmit
```

---

## 📚 Learn More

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Radix UI**: https://www.radix-ui.com/primitives/docs/overview/introduction

---

## 🎨 Customization

### Change Colors
Edit `lib/constants.ts`:
```typescript
export const BRAND = {
  accent: "#your-color",
  navy: "#your-color",
  // ... etc
};
```

### Add New Shell
1. Create component in `components/shells/`
2. Add to `SHELLS` in `lib/constants.ts`
3. Add case in `app/page.tsx` switch statement

### Add New Data Type
1. Define type in `types/index.ts`
2. Add state in `hooks/use-app-data.ts`
3. Use in components

---

## ✅ Checklist for New Features

- [ ] Define TypeScript types
- [ ] Add to data hook if state needed
- [ ] Create component(s)
- [ ] Add navigation if new shell
- [ ] Test responsiveness
- [ ] Update documentation

---

## 🤝 Need Help?

Check these files:
- **REFACTORING-SUMMARY.md** - Complete technical overview
- **README-APP.md** - Full documentation
- **This file** - Quick reference

---

## 🎉 You're Ready!

The app is fully functional and ready for:
- ✅ Development
- ✅ Customization  
- ✅ Extension
- ✅ Production deployment

Have fun building! 🚀
