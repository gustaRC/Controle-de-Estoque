import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
    <div class="footer bg-indigo-800 mt-3 p-5 pt-2 pb-2" style="border-radius: 1rem 1rem 0 0;">
        <div class="flex justify-content-between text-gray-100 flex-wrap gap-4" style="font-size: 14px;">
            <span>
                <span>Gustavo Rodrigues - Web Developer</span>
                <span> - v. 24.06.13.02</span>
            </span>
            <span>
                <span>Marcos Júnior © </span>
                <span> - Formação Angular - Udemy</span>
            </span>
        </div>
    </div>
    `,
})
export class AppFooterComponent implements OnInit{
  ngOnInit(): void {}
}
