# AI Development Rules & Tech Stack

This document outlines the technical standards and library preferences for the Happirate Fleet project.

## Tech Stack

- **Vite & React**: Core framework for a fast, modern single-page application.
- **TypeScript**: Mandatory for all files to ensure type safety and maintainability.
- **Tailwind CSS**: Primary styling method using utility-first classes.
- **shadcn/ui**: Base component library built on Radix UI primitives.
- **Lucide React**: Standard icon library for consistent visual language.
- **Framer Motion**: Used for all UI animations, transitions, and micro-interactions.
- **React Router DOM**: Handles all client-side routing and navigation.
- **TanStack Query**: Preferred for data fetching, caching, and server state management.
- **Sonner**: Standard library for toast notifications and user feedback.
- **Zod & React Hook Form**: The duo for robust form management and schema validation.

## Library Usage Rules

### Styling & Layout
- **Tailwind CSS**: Use Tailwind classes for all styling. Avoid custom CSS files or inline styles.
- **Responsive Design**: Always use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, etc.) to ensure mobile-first compatibility.
- **Class Merging**: Always use the `cn()` utility from `@/lib/utils` when combining conditional classes.

### Components
- **shadcn/ui**: Check `src/components/ui` first. If a component exists there, use it. If not, create a new component following the shadcn pattern.
- **Icons**: Use `lucide-react`. Do not import icons from other libraries unless specifically requested.
- **Animations**: Use `framer-motion` for entry animations (e.g., `initial`, `animate`) and layout transitions.

### State & Data
- **Server State**: Use `useQuery` and `useMutation` from `@tanstack/react-query` for all asynchronous operations.
- **Forms**: Use `react-hook-form` with `zodResolver`. Define validation schemas using `zod`.
- **Navigation**: Use `Link` or `useNavigate` from `react-router-dom`. Keep route definitions centralized in `src/App.tsx`.

### Feedback & Interaction
- **Notifications**: Use `toast` from `sonner` for success, error, and info messages.
- **Loading States**: Use shadcn `Skeleton` components or Framer Motion loading states for a polished feel.

## Project Structure
- **Pages**: Located in `src/pages/`.
- **Components**: Shared components in `src/components/`, feature-specific ones in subdirectories (e.g., `src/components/fleet/`).
- **Hooks**: Custom hooks in `src/hooks/`.
- **Lib**: Utilities and shared configurations in `src/lib/`.