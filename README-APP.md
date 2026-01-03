# TPA Interactive Shells - Planner's Assistant

A comprehensive interactive planning tool for managing local plan development through various stages and shells.

## Features

- **Multi-Shell Navigation**: Home, Programme, Policies, Places, Evidence, Engage, Scenarios, Monitoring
- **Stage Management**: Track progress through planning stages from scoping to monitoring
- **Reading Profiles**: Switch between different policy interpretation frameworks
- **Pressures Dashboard**: Monitor and respond to current planning pressures
- **Evidence Library**: Centralized evidence management with search and tagging
- **Consultation Management**: Handle multiple consultation rounds with representation tracking
- **Gateway Processes**: Manage Gateway 1, 2, and 3 submissions and advice
- **Options Analysis**: Explore and compare policy options with defensibility assessments
- **Monitoring Signals**: Track AMR-style monitoring indicators

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── shells/           # Shell-specific components
│   ├── ui/               # UI primitives (shadcn/ui)
│   ├── shell-nav.tsx     # Navigation component
│   ├── stage-ribbon.tsx  # Stage navigation
│   └── ...               # Other shared components
├── hooks/                # Custom React hooks
│   └── use-app-data.ts   # Application state management
├── lib/                  # Utility functions
│   ├── constants.ts      # App constants
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
    └── index.ts          # Core type definitions
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives + custom components
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Key Components

### Shells
- **Home**: Dashboard with current pressures and quick actions
- **Programme**: Timetable, gateways, governance, and submission tracking
- **Policies**: Policy drafting, vision & outcomes management
- **Places**: Sites pipeline and allocations management
- **Evidence**: Centralized evidence library with search
- **Engage**: Consultation and representation management
- **Decisions**: Options analysis with consequences and defensibility
- **Monitoring**: AMR-style signals and performance tracking

### Features
- Responsive design for desktop and mobile
- Real-time state management
- Tabbed interfaces for complex workflows
- Collapsible detail views
- Search and filtering capabilities
- Interactive plan and stage selection

## Development

### Adding New Components

Components follow the shadcn/ui pattern:

```typescript
// components/ui/new-component.tsx
import { cn } from "@/lib/utils";

export function NewComponent({ className, ...props }) {
  return <div className={cn("base-styles", className)} {...props} />;
}
```

### Adding New Shells

Create new shell components in `components/shells/`:

```typescript
// components/shells/shell-new.tsx
export function ShellNew() {
  return (
    <div className="space-y-4">
      <ShellHeader title="New Shell" subtitle="Description" />
      {/* Shell content */}
    </div>
  );
}
```

## License

See LICENSE file for details.

## Contributing

This is a prototype application. For production use, additional features would include:
- Backend API integration
- Database persistence
- User authentication
- Real-time collaboration
- Document generation
- Advanced search and filtering
- Analytics and reporting
